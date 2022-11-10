import { DbAuthHandler } from '@redwoodjs/api';
import { db } from "../lib/db";
export const handler = async (event, context) => {
  const forgotPasswordOptions = {
    // handler() is invoked after verifying that a user was found with the given
    // username. This is where you can send the user an email with a link to
    // reset their password. With the default dbAuth routes and field names, the
    // URL to reset the password will be:
    //
    // https://example.com/reset-password?resetToken=${user.resetToken}
    //
    // Whatever is returned from this function will be returned from
    // the `forgotPassword()` function that is destructured from `useAuth()`
    // You could use this return value to, for example, show the email
    // address in a toast message so the user will know it worked and where
    // to look for the email.
    handler: user => {
      return user;
    },
    // How long the resetToken is valid for, in seconds (default is 24 hours)
    expires: 60 * 60 * 24,
    errors: {
      // for security reasons you may want to be vague here rather than expose
      // the fact that the email address wasn't found (prevents fishing for
      // valid email addresses)
      usernameNotFound: 'Username not found',
      // if the user somehow gets around client validation
      usernameRequired: 'Username is required'
    }
  };
  const loginOptions = {
    // handler() is called after finding the user that matches the
    // username/password provided at login, but before actually considering them
    // logged in. The `user` argument will be the user in the database that
    // matched the username/password.
    //
    // If you want to allow this user to log in simply return the user.
    //
    // If you want to prevent someone logging in for another reason (maybe they
    // didn't validate their email yet), throw an error and it will be returned
    // by the `logIn()` function from `useAuth()` in the form of:
    // `{ message: 'Error message' }`
    handler: user => {
      return user;
    },
    errors: {
      usernameOrPasswordMissing: 'Both username and password are required',
      usernameNotFound: 'Username ${username} not found',
      // For security reasons you may want to make this the same as the
      // usernameNotFound error so that a malicious user can't use the error
      // to narrow down if it's the username or password that's incorrect
      incorrectPassword: 'Incorrect password for ${username}'
    },
    // How long a user will remain logged in, in seconds
    expires: 60 * 60 * 24 * 365 * 10
  };
  const resetPasswordOptions = {
    // handler() is invoked after the password has been successfully updated in
    // the database. Returning anything truthy will automatically log the user
    // in. Return `false` otherwise, and in the Reset Password page redirect the
    // user to the login page.
    handler: _user => {
      return true;
    },
    // If `false` then the new password MUST be different from the current one
    allowReusedPassword: true,
    errors: {
      // the resetToken is valid, but expired
      resetTokenExpired: 'resetToken is expired',
      // no user was found with the given resetToken
      resetTokenInvalid: 'resetToken is invalid',
      // the resetToken was not present in the URL
      resetTokenRequired: 'resetToken is required',
      // new password is the same as the old password (apparently they did not forget it)
      reusedPassword: 'Must choose a new password'
    }
  };
  const signupOptions = {
    // Whatever you want to happen to your data on new user signup. Redwood will
    // check for duplicate usernames before calling this handler. At a minimum
    // you need to save the `username`, `hashedPassword` and `salt` to your
    // user table. `userAttributes` contains any additional object members that
    // were included in the object given to the `signUp()` function you got
    // from `useAuth()`.
    //
    // If you want the user to be immediately logged in, return the user that
    // was created.
    //
    // If this handler throws an error, it will be returned by the `signUp()`
    // function in the form of: `{ error: 'Error message' }`.
    //
    // If this returns anything else, it will be returned by the
    // `signUp()` function in the form of: `{ message: 'String here' }`.
    handler: ({
      username,
      hashedPassword,
      salt,
      userAttributes
    }) => {
      return db.user.create({
        data: {
          email: username,
          hashedPassword: hashedPassword,
          salt: salt
          // name: userAttributes.name
        }
      });
    },

    // Include any format checks for password here. Return `true` if the
    // password is valid, otherwise throw a `PasswordValidationError`.
    // Import the error along with `DbAuthHandler` from `@redwoodjs/api` above.
    passwordValidation: _password => {
      return true;
    },
    errors: {
      // `field` will be either "username" or "password"
      fieldMissing: '${field} is required',
      usernameTaken: 'Username `${username}` already in use'
    }
  };
  const authHandler = new DbAuthHandler(event, context, {
    // Provide prisma db client
    db: db,
    // The name of the property you'd call on `db` to access your user table.
    // i.e. if your Prisma model is named `User` this value would be `user`, as in `db.user`
    authModelAccessor: 'user',
    // A map of what dbAuth calls a field to what your database calls it.
    // `id` is whatever column you use to uniquely identify a user (probably
    // something like `id` or `userId` or even `email`)
    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt'
    },
    // Specifies attributes on the cookie that dbAuth sets in order to remember
    // who is logged in. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies
    cookie: {
      HttpOnly: true,
      Path: '/',
      SameSite: 'Strict',
      Secure: process.env.NODE_ENV !== 'development'

      // If you need to allow other domains (besides the api side) access to
      // the dbAuth session cookie:
      // Domain: 'example.com',
    },

    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions
  });
  return await authHandler.invoke();
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEYkF1dGhIYW5kbGVyIiwiZGIiLCJoYW5kbGVyIiwiZXZlbnQiLCJjb250ZXh0IiwiZm9yZ290UGFzc3dvcmRPcHRpb25zIiwidXNlciIsImV4cGlyZXMiLCJlcnJvcnMiLCJ1c2VybmFtZU5vdEZvdW5kIiwidXNlcm5hbWVSZXF1aXJlZCIsImxvZ2luT3B0aW9ucyIsInVzZXJuYW1lT3JQYXNzd29yZE1pc3NpbmciLCJpbmNvcnJlY3RQYXNzd29yZCIsInJlc2V0UGFzc3dvcmRPcHRpb25zIiwiX3VzZXIiLCJhbGxvd1JldXNlZFBhc3N3b3JkIiwicmVzZXRUb2tlbkV4cGlyZWQiLCJyZXNldFRva2VuSW52YWxpZCIsInJlc2V0VG9rZW5SZXF1aXJlZCIsInJldXNlZFBhc3N3b3JkIiwic2lnbnVwT3B0aW9ucyIsInVzZXJuYW1lIiwiaGFzaGVkUGFzc3dvcmQiLCJzYWx0IiwidXNlckF0dHJpYnV0ZXMiLCJjcmVhdGUiLCJkYXRhIiwiZW1haWwiLCJwYXNzd29yZFZhbGlkYXRpb24iLCJfcGFzc3dvcmQiLCJmaWVsZE1pc3NpbmciLCJ1c2VybmFtZVRha2VuIiwiYXV0aEhhbmRsZXIiLCJhdXRoTW9kZWxBY2Nlc3NvciIsImF1dGhGaWVsZHMiLCJpZCIsInJlc2V0VG9rZW4iLCJyZXNldFRva2VuRXhwaXJlc0F0IiwiY29va2llIiwiSHR0cE9ubHkiLCJQYXRoIiwiU2FtZVNpdGUiLCJTZWN1cmUiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJmb3Jnb3RQYXNzd29yZCIsImxvZ2luIiwicmVzZXRQYXNzd29yZCIsInNpZ251cCIsImludm9rZSJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2FwaS9zcmMvZnVuY3Rpb25zL2F1dGguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGJBdXRoSGFuZGxlciB9IGZyb20gJ0ByZWR3b29kanMvYXBpJ1xuXG5pbXBvcnQgeyBkYiB9IGZyb20gJ3NyYy9saWIvZGInXG5cbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXN5bmMgKGV2ZW50LCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGZvcmdvdFBhc3N3b3JkT3B0aW9ucyA9IHtcbiAgICAvLyBoYW5kbGVyKCkgaXMgaW52b2tlZCBhZnRlciB2ZXJpZnlpbmcgdGhhdCBhIHVzZXIgd2FzIGZvdW5kIHdpdGggdGhlIGdpdmVuXG4gICAgLy8gdXNlcm5hbWUuIFRoaXMgaXMgd2hlcmUgeW91IGNhbiBzZW5kIHRoZSB1c2VyIGFuIGVtYWlsIHdpdGggYSBsaW5rIHRvXG4gICAgLy8gcmVzZXQgdGhlaXIgcGFzc3dvcmQuIFdpdGggdGhlIGRlZmF1bHQgZGJBdXRoIHJvdXRlcyBhbmQgZmllbGQgbmFtZXMsIHRoZVxuICAgIC8vIFVSTCB0byByZXNldCB0aGUgcGFzc3dvcmQgd2lsbCBiZTpcbiAgICAvL1xuICAgIC8vIGh0dHBzOi8vZXhhbXBsZS5jb20vcmVzZXQtcGFzc3dvcmQ/cmVzZXRUb2tlbj0ke3VzZXIucmVzZXRUb2tlbn1cbiAgICAvL1xuICAgIC8vIFdoYXRldmVyIGlzIHJldHVybmVkIGZyb20gdGhpcyBmdW5jdGlvbiB3aWxsIGJlIHJldHVybmVkIGZyb21cbiAgICAvLyB0aGUgYGZvcmdvdFBhc3N3b3JkKClgIGZ1bmN0aW9uIHRoYXQgaXMgZGVzdHJ1Y3R1cmVkIGZyb20gYHVzZUF1dGgoKWBcbiAgICAvLyBZb3UgY291bGQgdXNlIHRoaXMgcmV0dXJuIHZhbHVlIHRvLCBmb3IgZXhhbXBsZSwgc2hvdyB0aGUgZW1haWxcbiAgICAvLyBhZGRyZXNzIGluIGEgdG9hc3QgbWVzc2FnZSBzbyB0aGUgdXNlciB3aWxsIGtub3cgaXQgd29ya2VkIGFuZCB3aGVyZVxuICAgIC8vIHRvIGxvb2sgZm9yIHRoZSBlbWFpbC5cbiAgICBoYW5kbGVyOiAodXNlcikgPT4ge1xuICAgICAgcmV0dXJuIHVzZXJcbiAgICB9LFxuXG4gICAgLy8gSG93IGxvbmcgdGhlIHJlc2V0VG9rZW4gaXMgdmFsaWQgZm9yLCBpbiBzZWNvbmRzIChkZWZhdWx0IGlzIDI0IGhvdXJzKVxuICAgIGV4cGlyZXM6IDYwICogNjAgKiAyNCxcblxuICAgIGVycm9yczoge1xuICAgICAgLy8gZm9yIHNlY3VyaXR5IHJlYXNvbnMgeW91IG1heSB3YW50IHRvIGJlIHZhZ3VlIGhlcmUgcmF0aGVyIHRoYW4gZXhwb3NlXG4gICAgICAvLyB0aGUgZmFjdCB0aGF0IHRoZSBlbWFpbCBhZGRyZXNzIHdhc24ndCBmb3VuZCAocHJldmVudHMgZmlzaGluZyBmb3JcbiAgICAgIC8vIHZhbGlkIGVtYWlsIGFkZHJlc3NlcylcbiAgICAgIHVzZXJuYW1lTm90Rm91bmQ6ICdVc2VybmFtZSBub3QgZm91bmQnLFxuICAgICAgLy8gaWYgdGhlIHVzZXIgc29tZWhvdyBnZXRzIGFyb3VuZCBjbGllbnQgdmFsaWRhdGlvblxuICAgICAgdXNlcm5hbWVSZXF1aXJlZDogJ1VzZXJuYW1lIGlzIHJlcXVpcmVkJyxcbiAgICB9LFxuICB9XG5cbiAgY29uc3QgbG9naW5PcHRpb25zID0ge1xuICAgIC8vIGhhbmRsZXIoKSBpcyBjYWxsZWQgYWZ0ZXIgZmluZGluZyB0aGUgdXNlciB0aGF0IG1hdGNoZXMgdGhlXG4gICAgLy8gdXNlcm5hbWUvcGFzc3dvcmQgcHJvdmlkZWQgYXQgbG9naW4sIGJ1dCBiZWZvcmUgYWN0dWFsbHkgY29uc2lkZXJpbmcgdGhlbVxuICAgIC8vIGxvZ2dlZCBpbi4gVGhlIGB1c2VyYCBhcmd1bWVudCB3aWxsIGJlIHRoZSB1c2VyIGluIHRoZSBkYXRhYmFzZSB0aGF0XG4gICAgLy8gbWF0Y2hlZCB0aGUgdXNlcm5hbWUvcGFzc3dvcmQuXG4gICAgLy9cbiAgICAvLyBJZiB5b3Ugd2FudCB0byBhbGxvdyB0aGlzIHVzZXIgdG8gbG9nIGluIHNpbXBseSByZXR1cm4gdGhlIHVzZXIuXG4gICAgLy9cbiAgICAvLyBJZiB5b3Ugd2FudCB0byBwcmV2ZW50IHNvbWVvbmUgbG9nZ2luZyBpbiBmb3IgYW5vdGhlciByZWFzb24gKG1heWJlIHRoZXlcbiAgICAvLyBkaWRuJ3QgdmFsaWRhdGUgdGhlaXIgZW1haWwgeWV0KSwgdGhyb3cgYW4gZXJyb3IgYW5kIGl0IHdpbGwgYmUgcmV0dXJuZWRcbiAgICAvLyBieSB0aGUgYGxvZ0luKClgIGZ1bmN0aW9uIGZyb20gYHVzZUF1dGgoKWAgaW4gdGhlIGZvcm0gb2Y6XG4gICAgLy8gYHsgbWVzc2FnZTogJ0Vycm9yIG1lc3NhZ2UnIH1gXG4gICAgaGFuZGxlcjogKHVzZXIpID0+IHtcbiAgICAgIHJldHVybiB1c2VyXG4gICAgfSxcblxuICAgIGVycm9yczoge1xuICAgICAgdXNlcm5hbWVPclBhc3N3b3JkTWlzc2luZzogJ0JvdGggdXNlcm5hbWUgYW5kIHBhc3N3b3JkIGFyZSByZXF1aXJlZCcsXG4gICAgICB1c2VybmFtZU5vdEZvdW5kOiAnVXNlcm5hbWUgJHt1c2VybmFtZX0gbm90IGZvdW5kJyxcbiAgICAgIC8vIEZvciBzZWN1cml0eSByZWFzb25zIHlvdSBtYXkgd2FudCB0byBtYWtlIHRoaXMgdGhlIHNhbWUgYXMgdGhlXG4gICAgICAvLyB1c2VybmFtZU5vdEZvdW5kIGVycm9yIHNvIHRoYXQgYSBtYWxpY2lvdXMgdXNlciBjYW4ndCB1c2UgdGhlIGVycm9yXG4gICAgICAvLyB0byBuYXJyb3cgZG93biBpZiBpdCdzIHRoZSB1c2VybmFtZSBvciBwYXNzd29yZCB0aGF0J3MgaW5jb3JyZWN0XG4gICAgICBpbmNvcnJlY3RQYXNzd29yZDogJ0luY29ycmVjdCBwYXNzd29yZCBmb3IgJHt1c2VybmFtZX0nLFxuICAgIH0sXG5cbiAgICAvLyBIb3cgbG9uZyBhIHVzZXIgd2lsbCByZW1haW4gbG9nZ2VkIGluLCBpbiBzZWNvbmRzXG4gICAgZXhwaXJlczogNjAgKiA2MCAqIDI0ICogMzY1ICogMTAsXG4gIH1cblxuICBjb25zdCByZXNldFBhc3N3b3JkT3B0aW9ucyA9IHtcbiAgICAvLyBoYW5kbGVyKCkgaXMgaW52b2tlZCBhZnRlciB0aGUgcGFzc3dvcmQgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQgaW5cbiAgICAvLyB0aGUgZGF0YWJhc2UuIFJldHVybmluZyBhbnl0aGluZyB0cnV0aHkgd2lsbCBhdXRvbWF0aWNhbGx5IGxvZyB0aGUgdXNlclxuICAgIC8vIGluLiBSZXR1cm4gYGZhbHNlYCBvdGhlcndpc2UsIGFuZCBpbiB0aGUgUmVzZXQgUGFzc3dvcmQgcGFnZSByZWRpcmVjdCB0aGVcbiAgICAvLyB1c2VyIHRvIHRoZSBsb2dpbiBwYWdlLlxuICAgIGhhbmRsZXI6IChfdXNlcikgPT4ge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuXG4gICAgLy8gSWYgYGZhbHNlYCB0aGVuIHRoZSBuZXcgcGFzc3dvcmQgTVVTVCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgY3VycmVudCBvbmVcbiAgICBhbGxvd1JldXNlZFBhc3N3b3JkOiB0cnVlLFxuXG4gICAgZXJyb3JzOiB7XG4gICAgICAvLyB0aGUgcmVzZXRUb2tlbiBpcyB2YWxpZCwgYnV0IGV4cGlyZWRcbiAgICAgIHJlc2V0VG9rZW5FeHBpcmVkOiAncmVzZXRUb2tlbiBpcyBleHBpcmVkJyxcbiAgICAgIC8vIG5vIHVzZXIgd2FzIGZvdW5kIHdpdGggdGhlIGdpdmVuIHJlc2V0VG9rZW5cbiAgICAgIHJlc2V0VG9rZW5JbnZhbGlkOiAncmVzZXRUb2tlbiBpcyBpbnZhbGlkJyxcbiAgICAgIC8vIHRoZSByZXNldFRva2VuIHdhcyBub3QgcHJlc2VudCBpbiB0aGUgVVJMXG4gICAgICByZXNldFRva2VuUmVxdWlyZWQ6ICdyZXNldFRva2VuIGlzIHJlcXVpcmVkJyxcbiAgICAgIC8vIG5ldyBwYXNzd29yZCBpcyB0aGUgc2FtZSBhcyB0aGUgb2xkIHBhc3N3b3JkIChhcHBhcmVudGx5IHRoZXkgZGlkIG5vdCBmb3JnZXQgaXQpXG4gICAgICByZXVzZWRQYXNzd29yZDogJ011c3QgY2hvb3NlIGEgbmV3IHBhc3N3b3JkJyxcbiAgICB9LFxuICB9XG5cbiAgY29uc3Qgc2lnbnVwT3B0aW9ucyA9IHtcbiAgICAvLyBXaGF0ZXZlciB5b3Ugd2FudCB0byBoYXBwZW4gdG8geW91ciBkYXRhIG9uIG5ldyB1c2VyIHNpZ251cC4gUmVkd29vZCB3aWxsXG4gICAgLy8gY2hlY2sgZm9yIGR1cGxpY2F0ZSB1c2VybmFtZXMgYmVmb3JlIGNhbGxpbmcgdGhpcyBoYW5kbGVyLiBBdCBhIG1pbmltdW1cbiAgICAvLyB5b3UgbmVlZCB0byBzYXZlIHRoZSBgdXNlcm5hbWVgLCBgaGFzaGVkUGFzc3dvcmRgIGFuZCBgc2FsdGAgdG8geW91clxuICAgIC8vIHVzZXIgdGFibGUuIGB1c2VyQXR0cmlidXRlc2AgY29udGFpbnMgYW55IGFkZGl0aW9uYWwgb2JqZWN0IG1lbWJlcnMgdGhhdFxuICAgIC8vIHdlcmUgaW5jbHVkZWQgaW4gdGhlIG9iamVjdCBnaXZlbiB0byB0aGUgYHNpZ25VcCgpYCBmdW5jdGlvbiB5b3UgZ290XG4gICAgLy8gZnJvbSBgdXNlQXV0aCgpYC5cbiAgICAvL1xuICAgIC8vIElmIHlvdSB3YW50IHRoZSB1c2VyIHRvIGJlIGltbWVkaWF0ZWx5IGxvZ2dlZCBpbiwgcmV0dXJuIHRoZSB1c2VyIHRoYXRcbiAgICAvLyB3YXMgY3JlYXRlZC5cbiAgICAvL1xuICAgIC8vIElmIHRoaXMgaGFuZGxlciB0aHJvd3MgYW4gZXJyb3IsIGl0IHdpbGwgYmUgcmV0dXJuZWQgYnkgdGhlIGBzaWduVXAoKWBcbiAgICAvLyBmdW5jdGlvbiBpbiB0aGUgZm9ybSBvZjogYHsgZXJyb3I6ICdFcnJvciBtZXNzYWdlJyB9YC5cbiAgICAvL1xuICAgIC8vIElmIHRoaXMgcmV0dXJucyBhbnl0aGluZyBlbHNlLCBpdCB3aWxsIGJlIHJldHVybmVkIGJ5IHRoZVxuICAgIC8vIGBzaWduVXAoKWAgZnVuY3Rpb24gaW4gdGhlIGZvcm0gb2Y6IGB7IG1lc3NhZ2U6ICdTdHJpbmcgaGVyZScgfWAuXG4gICAgaGFuZGxlcjogKHsgdXNlcm5hbWUsIGhhc2hlZFBhc3N3b3JkLCBzYWx0LCB1c2VyQXR0cmlidXRlcyB9KSA9PiB7XG4gICAgICByZXR1cm4gZGIudXNlci5jcmVhdGUoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZW1haWw6IHVzZXJuYW1lLFxuICAgICAgICAgIGhhc2hlZFBhc3N3b3JkOiBoYXNoZWRQYXNzd29yZCxcbiAgICAgICAgICBzYWx0OiBzYWx0LFxuICAgICAgICAgIC8vIG5hbWU6IHVzZXJBdHRyaWJ1dGVzLm5hbWVcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIC8vIEluY2x1ZGUgYW55IGZvcm1hdCBjaGVja3MgZm9yIHBhc3N3b3JkIGhlcmUuIFJldHVybiBgdHJ1ZWAgaWYgdGhlXG4gICAgLy8gcGFzc3dvcmQgaXMgdmFsaWQsIG90aGVyd2lzZSB0aHJvdyBhIGBQYXNzd29yZFZhbGlkYXRpb25FcnJvcmAuXG4gICAgLy8gSW1wb3J0IHRoZSBlcnJvciBhbG9uZyB3aXRoIGBEYkF1dGhIYW5kbGVyYCBmcm9tIGBAcmVkd29vZGpzL2FwaWAgYWJvdmUuXG4gICAgcGFzc3dvcmRWYWxpZGF0aW9uOiAoX3Bhc3N3b3JkKSA9PiB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG5cbiAgICBlcnJvcnM6IHtcbiAgICAgIC8vIGBmaWVsZGAgd2lsbCBiZSBlaXRoZXIgXCJ1c2VybmFtZVwiIG9yIFwicGFzc3dvcmRcIlxuICAgICAgZmllbGRNaXNzaW5nOiAnJHtmaWVsZH0gaXMgcmVxdWlyZWQnLFxuICAgICAgdXNlcm5hbWVUYWtlbjogJ1VzZXJuYW1lIGAke3VzZXJuYW1lfWAgYWxyZWFkeSBpbiB1c2UnLFxuICAgIH0sXG4gIH1cblxuICBjb25zdCBhdXRoSGFuZGxlciA9IG5ldyBEYkF1dGhIYW5kbGVyKGV2ZW50LCBjb250ZXh0LCB7XG4gICAgLy8gUHJvdmlkZSBwcmlzbWEgZGIgY2xpZW50XG4gICAgZGI6IGRiLFxuXG4gICAgLy8gVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHlvdSdkIGNhbGwgb24gYGRiYCB0byBhY2Nlc3MgeW91ciB1c2VyIHRhYmxlLlxuICAgIC8vIGkuZS4gaWYgeW91ciBQcmlzbWEgbW9kZWwgaXMgbmFtZWQgYFVzZXJgIHRoaXMgdmFsdWUgd291bGQgYmUgYHVzZXJgLCBhcyBpbiBgZGIudXNlcmBcbiAgICBhdXRoTW9kZWxBY2Nlc3NvcjogJ3VzZXInLFxuXG4gICAgLy8gQSBtYXAgb2Ygd2hhdCBkYkF1dGggY2FsbHMgYSBmaWVsZCB0byB3aGF0IHlvdXIgZGF0YWJhc2UgY2FsbHMgaXQuXG4gICAgLy8gYGlkYCBpcyB3aGF0ZXZlciBjb2x1bW4geW91IHVzZSB0byB1bmlxdWVseSBpZGVudGlmeSBhIHVzZXIgKHByb2JhYmx5XG4gICAgLy8gc29tZXRoaW5nIGxpa2UgYGlkYCBvciBgdXNlcklkYCBvciBldmVuIGBlbWFpbGApXG4gICAgYXV0aEZpZWxkczoge1xuICAgICAgaWQ6ICdpZCcsXG4gICAgICB1c2VybmFtZTogJ2VtYWlsJyxcbiAgICAgIGhhc2hlZFBhc3N3b3JkOiAnaGFzaGVkUGFzc3dvcmQnLFxuICAgICAgc2FsdDogJ3NhbHQnLFxuICAgICAgcmVzZXRUb2tlbjogJ3Jlc2V0VG9rZW4nLFxuICAgICAgcmVzZXRUb2tlbkV4cGlyZXNBdDogJ3Jlc2V0VG9rZW5FeHBpcmVzQXQnLFxuICAgIH0sXG5cbiAgICAvLyBTcGVjaWZpZXMgYXR0cmlidXRlcyBvbiB0aGUgY29va2llIHRoYXQgZGJBdXRoIHNldHMgaW4gb3JkZXIgdG8gcmVtZW1iZXJcbiAgICAvLyB3aG8gaXMgbG9nZ2VkIGluLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRUUC9Db29raWVzI3Jlc3RyaWN0X2FjY2Vzc190b19jb29raWVzXG4gICAgY29va2llOiB7XG4gICAgICBIdHRwT25seTogdHJ1ZSxcbiAgICAgIFBhdGg6ICcvJyxcbiAgICAgIFNhbWVTaXRlOiAnU3RyaWN0JyxcbiAgICAgIFNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdkZXZlbG9wbWVudCcsXG5cbiAgICAgIC8vIElmIHlvdSBuZWVkIHRvIGFsbG93IG90aGVyIGRvbWFpbnMgKGJlc2lkZXMgdGhlIGFwaSBzaWRlKSBhY2Nlc3MgdG9cbiAgICAgIC8vIHRoZSBkYkF1dGggc2Vzc2lvbiBjb29raWU6XG4gICAgICAvLyBEb21haW46ICdleGFtcGxlLmNvbScsXG4gICAgfSxcblxuICAgIGZvcmdvdFBhc3N3b3JkOiBmb3Jnb3RQYXNzd29yZE9wdGlvbnMsXG4gICAgbG9naW46IGxvZ2luT3B0aW9ucyxcbiAgICByZXNldFBhc3N3b3JkOiByZXNldFBhc3N3b3JkT3B0aW9ucyxcbiAgICBzaWdudXA6IHNpZ251cE9wdGlvbnMsXG4gIH0pXG5cbiAgcmV0dXJuIGF3YWl0IGF1dGhIYW5kbGVyLmludm9rZSgpXG59XG4iXSwibWFwcGluZ3MiOiJBQUFBLFNBQVNBLGFBQWEsUUFBUSxnQkFBZ0I7QUFFOUMsU0FBU0MsRUFBRTtBQUVYLE9BQU8sTUFBTUMsT0FBTyxHQUFHLE9BQU9DLEtBQUssRUFBRUMsT0FBTyxLQUFLO0VBQy9DLE1BQU1DLHFCQUFxQixHQUFHO0lBQzVCO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBSCxPQUFPLEVBQUdJLElBQUksSUFBSztNQUNqQixPQUFPQSxJQUFJO0lBQ2IsQ0FBQztJQUVEO0lBQ0FDLE9BQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7SUFFckJDLE1BQU0sRUFBRTtNQUNOO01BQ0E7TUFDQTtNQUNBQyxnQkFBZ0IsRUFBRSxvQkFBb0I7TUFDdEM7TUFDQUMsZ0JBQWdCLEVBQUU7SUFDcEI7RUFDRixDQUFDO0VBRUQsTUFBTUMsWUFBWSxHQUFHO0lBQ25CO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQVQsT0FBTyxFQUFHSSxJQUFJLElBQUs7TUFDakIsT0FBT0EsSUFBSTtJQUNiLENBQUM7SUFFREUsTUFBTSxFQUFFO01BQ05JLHlCQUF5QixFQUFFLHlDQUF5QztNQUNwRUgsZ0JBQWdCLEVBQUUsZ0NBQWdDO01BQ2xEO01BQ0E7TUFDQTtNQUNBSSxpQkFBaUIsRUFBRTtJQUNyQixDQUFDO0lBRUQ7SUFDQU4sT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRztFQUNoQyxDQUFDO0VBRUQsTUFBTU8sb0JBQW9CLEdBQUc7SUFDM0I7SUFDQTtJQUNBO0lBQ0E7SUFDQVosT0FBTyxFQUFHYSxLQUFLLElBQUs7TUFDbEIsT0FBTyxJQUFJO0lBQ2IsQ0FBQztJQUVEO0lBQ0FDLG1CQUFtQixFQUFFLElBQUk7SUFFekJSLE1BQU0sRUFBRTtNQUNOO01BQ0FTLGlCQUFpQixFQUFFLHVCQUF1QjtNQUMxQztNQUNBQyxpQkFBaUIsRUFBRSx1QkFBdUI7TUFDMUM7TUFDQUMsa0JBQWtCLEVBQUUsd0JBQXdCO01BQzVDO01BQ0FDLGNBQWMsRUFBRTtJQUNsQjtFQUNGLENBQUM7RUFFRCxNQUFNQyxhQUFhLEdBQUc7SUFDcEI7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0FuQixPQUFPLEVBQUUsQ0FBQztNQUFFb0IsUUFBUTtNQUFFQyxjQUFjO01BQUVDLElBQUk7TUFBRUM7SUFBZSxDQUFDLEtBQUs7TUFDL0QsT0FBT3hCLEVBQUUsQ0FBQ0ssSUFBSSxDQUFDb0IsTUFBTSxDQUFDO1FBQ3BCQyxJQUFJLEVBQUU7VUFDSkMsS0FBSyxFQUFFTixRQUFRO1VBQ2ZDLGNBQWMsRUFBRUEsY0FBYztVQUM5QkMsSUFBSSxFQUFFQTtVQUNOO1FBQ0Y7TUFDRixDQUFDLENBQUM7SUFDSixDQUFDOztJQUVEO0lBQ0E7SUFDQTtJQUNBSyxrQkFBa0IsRUFBR0MsU0FBUyxJQUFLO01BQ2pDLE9BQU8sSUFBSTtJQUNiLENBQUM7SUFFRHRCLE1BQU0sRUFBRTtNQUNOO01BQ0F1QixZQUFZLEVBQUUsc0JBQXNCO01BQ3BDQyxhQUFhLEVBQUU7SUFDakI7RUFDRixDQUFDO0VBRUQsTUFBTUMsV0FBVyxHQUFHLElBQUlqQyxhQUFhLENBQUNHLEtBQUssRUFBRUMsT0FBTyxFQUFFO0lBQ3BEO0lBQ0FILEVBQUUsRUFBRUEsRUFBRTtJQUVOO0lBQ0E7SUFDQWlDLGlCQUFpQixFQUFFLE1BQU07SUFFekI7SUFDQTtJQUNBO0lBQ0FDLFVBQVUsRUFBRTtNQUNWQyxFQUFFLEVBQUUsSUFBSTtNQUNSZCxRQUFRLEVBQUUsT0FBTztNQUNqQkMsY0FBYyxFQUFFLGdCQUFnQjtNQUNoQ0MsSUFBSSxFQUFFLE1BQU07TUFDWmEsVUFBVSxFQUFFLFlBQVk7TUFDeEJDLG1CQUFtQixFQUFFO0lBQ3ZCLENBQUM7SUFFRDtJQUNBO0lBQ0FDLE1BQU0sRUFBRTtNQUNOQyxRQUFRLEVBQUUsSUFBSTtNQUNkQyxJQUFJLEVBQUUsR0FBRztNQUNUQyxRQUFRLEVBQUUsUUFBUTtNQUNsQkMsTUFBTSxFQUFFQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0MsUUFBUSxLQUFLOztNQUVqQztNQUNBO01BQ0E7SUFDRixDQUFDOztJQUVEQyxjQUFjLEVBQUUxQyxxQkFBcUI7SUFDckMyQyxLQUFLLEVBQUVyQyxZQUFZO0lBQ25Cc0MsYUFBYSxFQUFFbkMsb0JBQW9CO0lBQ25Db0MsTUFBTSxFQUFFN0I7RUFDVixDQUFDLENBQUM7RUFFRixPQUFPLE1BQU1ZLFdBQVcsQ0FBQ2tCLE1BQU0sRUFBRTtBQUNuQyxDQUFDIn0=