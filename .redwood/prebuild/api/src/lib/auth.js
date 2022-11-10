import _Array$isArray from "@babel/runtime-corejs3/core-js/array/is-array";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js/instance/includes";
import _someInstanceProperty from "@babel/runtime-corejs3/core-js/instance/some";
import { AuthenticationError, ForbiddenError, context } from '@redwoodjs/graphql-server';
import { db } from './db';

/**
 * The session object sent in as the first argument to getCurrentUser() will
 * have a single key `id` containing the unique ID of the logged in user
 * (whatever field you set as `authFields.id` in your auth function config).
 * You'll need to update the call to `db` below if you use a different model
 * name or unique field name, for example:
 *
 *   return await db.profile.findUnique({ where: { email: session.id } })
 *                   ───┬───                       ──┬──
 *      model accessor ─┘      unique id field name ─┘
 *
 * !! BEWARE !! Anything returned from this function will be available to the
 * client--it becomes the content of `currentUser` on the web side (as well as
 * `context.currentUser` on the api side). You should carefully add additional
 * fields to the `select` object below once you've decided they are safe to be
 * seen if someone were to open the Web Inspector in their browser.
 */
export const getCurrentUser = async session => {
  if (!session || typeof session.id !== 'number') {
    throw new Error('Invalid session');
  }
  return await db.user.findUnique({
    where: {
      id: session.id
    },
    select: {
      id: true
    }
  });
};

/**
 * The user is authenticated if there is a currentUser in the context
 *
 * @returns {boolean} - If the currentUser is authenticated
 */
export const isAuthenticated = () => {
  return !!context.currentUser;
};

/**
 * When checking role membership, roles can be a single value, a list, or none.
 * You can use Prisma enums too (if you're using them for roles), just import your enum type from `@prisma/client`
 */

/**
 * Checks if the currentUser is authenticated (and assigned one of the given roles)
 *
 * @param roles: {@link AllowedRoles} - Checks if the currentUser is assigned one of these roles
 *
 * @returns {boolean} - Returns true if the currentUser is logged in and assigned one of the given roles,
 * or when no roles are provided to check against. Otherwise returns false.
 */
export const hasRole = roles => {
  if (!isAuthenticated()) {
    return false;
  }
  const currentUserRoles = context.currentUser?.roles;
  if (typeof roles === 'string') {
    if (typeof currentUserRoles === 'string') {
      // roles to check is a string, currentUser.roles is a string
      return currentUserRoles === roles;
    } else if (_Array$isArray(currentUserRoles)) {
      // roles to check is a string, currentUser.roles is an array
      return currentUserRoles?.some(allowedRole => roles === allowedRole);
    }
  }
  if (_Array$isArray(roles)) {
    if (_Array$isArray(currentUserRoles)) {
      // roles to check is an array, currentUser.roles is an array
      return currentUserRoles?.some(allowedRole => _includesInstanceProperty(roles).call(roles, allowedRole));
    } else if (typeof currentUserRoles === 'string') {
      // roles to check is an array, currentUser.roles is a string
      return _someInstanceProperty(roles).call(roles, allowedRole => currentUserRoles === allowedRole);
    }
  }

  // roles not found
  return false;
};

/**
 * Use requireAuth in your services to check that a user is logged in,
 * whether or not they are assigned a role, and optionally raise an
 * error if they're not.
 *
 * @param roles: {@link AllowedRoles} - When checking role membership, these roles grant access.
 *
 * @returns - If the currentUser is authenticated (and assigned one of the given roles)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} If the currentUser is not allowed due to role permissions
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const requireAuth = ({
  roles
} = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.");
  }
  if (roles && !hasRole(roles)) {
    throw new ForbiddenError("You don't have access to do that.");
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBdXRoZW50aWNhdGlvbkVycm9yIiwiRm9yYmlkZGVuRXJyb3IiLCJjb250ZXh0IiwiZGIiLCJnZXRDdXJyZW50VXNlciIsInNlc3Npb24iLCJpZCIsIkVycm9yIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsInNlbGVjdCIsImlzQXV0aGVudGljYXRlZCIsImN1cnJlbnRVc2VyIiwiaGFzUm9sZSIsInJvbGVzIiwiY3VycmVudFVzZXJSb2xlcyIsInNvbWUiLCJhbGxvd2VkUm9sZSIsInJlcXVpcmVBdXRoIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vYXBpL3NyYy9saWIvYXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdXRoZW50aWNhdGlvbkVycm9yLCBGb3JiaWRkZW5FcnJvciB9IGZyb20gJ0ByZWR3b29kanMvZ3JhcGhxbC1zZXJ2ZXInXG5cbmltcG9ydCB7IGRiIH0gZnJvbSAnLi9kYidcblxuLyoqXG4gKiBUaGUgc2Vzc2lvbiBvYmplY3Qgc2VudCBpbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gZ2V0Q3VycmVudFVzZXIoKSB3aWxsXG4gKiBoYXZlIGEgc2luZ2xlIGtleSBgaWRgIGNvbnRhaW5pbmcgdGhlIHVuaXF1ZSBJRCBvZiB0aGUgbG9nZ2VkIGluIHVzZXJcbiAqICh3aGF0ZXZlciBmaWVsZCB5b3Ugc2V0IGFzIGBhdXRoRmllbGRzLmlkYCBpbiB5b3VyIGF1dGggZnVuY3Rpb24gY29uZmlnKS5cbiAqIFlvdSdsbCBuZWVkIHRvIHVwZGF0ZSB0aGUgY2FsbCB0byBgZGJgIGJlbG93IGlmIHlvdSB1c2UgYSBkaWZmZXJlbnQgbW9kZWxcbiAqIG5hbWUgb3IgdW5pcXVlIGZpZWxkIG5hbWUsIGZvciBleGFtcGxlOlxuICpcbiAqICAgcmV0dXJuIGF3YWl0IGRiLnByb2ZpbGUuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGVtYWlsOiBzZXNzaW9uLmlkIH0gfSlcbiAqICAgICAgICAgICAgICAgICAgIOKUgOKUgOKUgOKUrOKUgOKUgOKUgCAgICAgICAgICAgICAgICAgICAgICAg4pSA4pSA4pSs4pSA4pSAXG4gKiAgICAgIG1vZGVsIGFjY2Vzc29yIOKUgOKUmCAgICAgIHVuaXF1ZSBpZCBmaWVsZCBuYW1lIOKUgOKUmFxuICpcbiAqICEhIEJFV0FSRSAhISBBbnl0aGluZyByZXR1cm5lZCBmcm9tIHRoaXMgZnVuY3Rpb24gd2lsbCBiZSBhdmFpbGFibGUgdG8gdGhlXG4gKiBjbGllbnQtLWl0IGJlY29tZXMgdGhlIGNvbnRlbnQgb2YgYGN1cnJlbnRVc2VyYCBvbiB0aGUgd2ViIHNpZGUgKGFzIHdlbGwgYXNcbiAqIGBjb250ZXh0LmN1cnJlbnRVc2VyYCBvbiB0aGUgYXBpIHNpZGUpLiBZb3Ugc2hvdWxkIGNhcmVmdWxseSBhZGQgYWRkaXRpb25hbFxuICogZmllbGRzIHRvIHRoZSBgc2VsZWN0YCBvYmplY3QgYmVsb3cgb25jZSB5b3UndmUgZGVjaWRlZCB0aGV5IGFyZSBzYWZlIHRvIGJlXG4gKiBzZWVuIGlmIHNvbWVvbmUgd2VyZSB0byBvcGVuIHRoZSBXZWIgSW5zcGVjdG9yIGluIHRoZWlyIGJyb3dzZXIuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDdXJyZW50VXNlciA9IGFzeW5jIChzZXNzaW9uKSA9PiB7XG4gIGlmICghc2Vzc2lvbiB8fCB0eXBlb2Ygc2Vzc2lvbi5pZCAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc2Vzc2lvbicpXG4gIH1cblxuICByZXR1cm4gYXdhaXQgZGIudXNlci5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBpZDogc2Vzc2lvbi5pZCB9LFxuICAgIHNlbGVjdDogeyBpZDogdHJ1ZSB9LFxuICB9KVxufVxuXG4vKipcbiAqIFRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQgaWYgdGhlcmUgaXMgYSBjdXJyZW50VXNlciBpbiB0aGUgY29udGV4dFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSAtIElmIHRoZSBjdXJyZW50VXNlciBpcyBhdXRoZW50aWNhdGVkXG4gKi9cbmV4cG9ydCBjb25zdCBpc0F1dGhlbnRpY2F0ZWQgPSAoKSA9PiB7XG4gIHJldHVybiAhIWNvbnRleHQuY3VycmVudFVzZXJcbn1cblxuLyoqXG4gKiBXaGVuIGNoZWNraW5nIHJvbGUgbWVtYmVyc2hpcCwgcm9sZXMgY2FuIGJlIGEgc2luZ2xlIHZhbHVlLCBhIGxpc3QsIG9yIG5vbmUuXG4gKiBZb3UgY2FuIHVzZSBQcmlzbWEgZW51bXMgdG9vIChpZiB5b3UncmUgdXNpbmcgdGhlbSBmb3Igcm9sZXMpLCBqdXN0IGltcG9ydCB5b3VyIGVudW0gdHlwZSBmcm9tIGBAcHJpc21hL2NsaWVudGBcbiAqL1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgY3VycmVudFVzZXIgaXMgYXV0aGVudGljYXRlZCAoYW5kIGFzc2lnbmVkIG9uZSBvZiB0aGUgZ2l2ZW4gcm9sZXMpXG4gKlxuICogQHBhcmFtIHJvbGVzOiB7QGxpbmsgQWxsb3dlZFJvbGVzfSAtIENoZWNrcyBpZiB0aGUgY3VycmVudFVzZXIgaXMgYXNzaWduZWQgb25lIG9mIHRoZXNlIHJvbGVzXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IC0gUmV0dXJucyB0cnVlIGlmIHRoZSBjdXJyZW50VXNlciBpcyBsb2dnZWQgaW4gYW5kIGFzc2lnbmVkIG9uZSBvZiB0aGUgZ2l2ZW4gcm9sZXMsXG4gKiBvciB3aGVuIG5vIHJvbGVzIGFyZSBwcm92aWRlZCB0byBjaGVjayBhZ2FpbnN0LiBPdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGhhc1JvbGUgPSAocm9sZXMpID0+IHtcbiAgaWYgKCFpc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29uc3QgY3VycmVudFVzZXJSb2xlcyA9IGNvbnRleHQuY3VycmVudFVzZXI/LnJvbGVzXG5cbiAgaWYgKHR5cGVvZiByb2xlcyA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIGN1cnJlbnRVc2VyUm9sZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyByb2xlcyB0byBjaGVjayBpcyBhIHN0cmluZywgY3VycmVudFVzZXIucm9sZXMgaXMgYSBzdHJpbmdcbiAgICAgIHJldHVybiBjdXJyZW50VXNlclJvbGVzID09PSByb2xlc1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjdXJyZW50VXNlclJvbGVzKSkge1xuICAgICAgLy8gcm9sZXMgdG8gY2hlY2sgaXMgYSBzdHJpbmcsIGN1cnJlbnRVc2VyLnJvbGVzIGlzIGFuIGFycmF5XG4gICAgICByZXR1cm4gY3VycmVudFVzZXJSb2xlcz8uc29tZSgoYWxsb3dlZFJvbGUpID0+IHJvbGVzID09PSBhbGxvd2VkUm9sZSlcbiAgICB9XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShyb2xlcykpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjdXJyZW50VXNlclJvbGVzKSkge1xuICAgICAgLy8gcm9sZXMgdG8gY2hlY2sgaXMgYW4gYXJyYXksIGN1cnJlbnRVc2VyLnJvbGVzIGlzIGFuIGFycmF5XG4gICAgICByZXR1cm4gY3VycmVudFVzZXJSb2xlcz8uc29tZSgoYWxsb3dlZFJvbGUpID0+XG4gICAgICAgIHJvbGVzLmluY2x1ZGVzKGFsbG93ZWRSb2xlKVxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGN1cnJlbnRVc2VyUm9sZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyByb2xlcyB0byBjaGVjayBpcyBhbiBhcnJheSwgY3VycmVudFVzZXIucm9sZXMgaXMgYSBzdHJpbmdcbiAgICAgIHJldHVybiByb2xlcy5zb21lKChhbGxvd2VkUm9sZSkgPT4gY3VycmVudFVzZXJSb2xlcyA9PT0gYWxsb3dlZFJvbGUpXG4gICAgfVxuICB9XG5cbiAgLy8gcm9sZXMgbm90IGZvdW5kXG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIFVzZSByZXF1aXJlQXV0aCBpbiB5b3VyIHNlcnZpY2VzIHRvIGNoZWNrIHRoYXQgYSB1c2VyIGlzIGxvZ2dlZCBpbixcbiAqIHdoZXRoZXIgb3Igbm90IHRoZXkgYXJlIGFzc2lnbmVkIGEgcm9sZSwgYW5kIG9wdGlvbmFsbHkgcmFpc2UgYW5cbiAqIGVycm9yIGlmIHRoZXkncmUgbm90LlxuICpcbiAqIEBwYXJhbSByb2xlczoge0BsaW5rIEFsbG93ZWRSb2xlc30gLSBXaGVuIGNoZWNraW5nIHJvbGUgbWVtYmVyc2hpcCwgdGhlc2Ugcm9sZXMgZ3JhbnQgYWNjZXNzLlxuICpcbiAqIEByZXR1cm5zIC0gSWYgdGhlIGN1cnJlbnRVc2VyIGlzIGF1dGhlbnRpY2F0ZWQgKGFuZCBhc3NpZ25lZCBvbmUgb2YgdGhlIGdpdmVuIHJvbGVzKVxuICpcbiAqIEB0aHJvd3Mge0BsaW5rIEF1dGhlbnRpY2F0aW9uRXJyb3J9IC0gSWYgdGhlIGN1cnJlbnRVc2VyIGlzIG5vdCBhdXRoZW50aWNhdGVkXG4gKiBAdGhyb3dzIHtAbGluayBGb3JiaWRkZW5FcnJvcn0gSWYgdGhlIGN1cnJlbnRVc2VyIGlzIG5vdCBhbGxvd2VkIGR1ZSB0byByb2xlIHBlcm1pc3Npb25zXG4gKlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVkd29vZGpzL3JlZHdvb2QvdHJlZS9tYWluL3BhY2thZ2VzL2F1dGggZm9yIGV4YW1wbGVzXG4gKi9cbmV4cG9ydCBjb25zdCByZXF1aXJlQXV0aCA9ICh7IHJvbGVzIH0gPSB7fSkgPT4ge1xuICBpZiAoIWlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgdGhyb3cgbmV3IEF1dGhlbnRpY2F0aW9uRXJyb3IoXCJZb3UgZG9uJ3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRvIHRoYXQuXCIpXG4gIH1cblxuICBpZiAocm9sZXMgJiYgIWhhc1JvbGUocm9sZXMpKSB7XG4gICAgdGhyb3cgbmV3IEZvcmJpZGRlbkVycm9yKFwiWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIGRvIHRoYXQuXCIpXG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsU0FBU0EsbUJBQW1CLEVBQUVD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