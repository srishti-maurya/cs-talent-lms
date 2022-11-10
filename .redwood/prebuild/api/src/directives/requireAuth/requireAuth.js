import { createValidatorDirective } from '@redwoodjs/graphql-server';
import { requireAuth as applicationRequireAuth } from "../../lib/auth";
export const schema = {
  "kind": "Document",
  "definitions": [{
    "kind": "DirectiveDefinition",
    "description": {
      "kind": "StringValue",
      "value": "Use to check whether or not a user is authenticated and is associated\nwith an optional set of roles.",
      "block": true
    },
    "name": {
      "kind": "Name",
      "value": "requireAuth"
    },
    "arguments": [{
      "kind": "InputValueDefinition",
      "name": {
        "kind": "Name",
        "value": "roles"
      },
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }],
    "repeatable": false,
    "locations": [{
      "kind": "Name",
      "value": "FIELD_DEFINITION"
    }]
  }],
  "loc": {
    "start": 0,
    "end": 180,
    "source": {
      "body": "\n  \"\"\"\n  Use to check whether or not a user is authenticated and is associated\n  with an optional set of roles.\n  \"\"\"\n  directive @requireAuth(roles: [String]) on FIELD_DEFINITION\n",
      "name": "GraphQL request",
      "locationOffset": {
        "line": 1,
        "column": 1
      }
    }
  }
};
const validate = ({
  directiveArgs
}) => {
  const {
    roles
  } = directiveArgs;
  applicationRequireAuth({
    roles
  });
};
const requireAuth = createValidatorDirective(schema, validate);
export default requireAuth;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjcmVhdGVWYWxpZGF0b3JEaXJlY3RpdmUiLCJyZXF1aXJlQXV0aCIsImFwcGxpY2F0aW9uUmVxdWlyZUF1dGgiLCJzY2hlbWEiLCJ2YWxpZGF0ZSIsImRpcmVjdGl2ZUFyZ3MiLCJyb2xlcyJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2FwaS9zcmMvZGlyZWN0aXZlcy9yZXF1aXJlQXV0aC9yZXF1aXJlQXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ3FsIGZyb20gJ2dyYXBocWwtdGFnJ1xuXG5pbXBvcnQgeyBjcmVhdGVWYWxpZGF0b3JEaXJlY3RpdmUgfSBmcm9tICdAcmVkd29vZGpzL2dyYXBocWwtc2VydmVyJ1xuXG5pbXBvcnQgeyByZXF1aXJlQXV0aCBhcyBhcHBsaWNhdGlvblJlcXVpcmVBdXRoIH0gZnJvbSAnc3JjL2xpYi9hdXRoJ1xuXG5leHBvcnQgY29uc3Qgc2NoZW1hID0gZ3FsYFxuICBcIlwiXCJcbiAgVXNlIHRvIGNoZWNrIHdoZXRoZXIgb3Igbm90IGEgdXNlciBpcyBhdXRoZW50aWNhdGVkIGFuZCBpcyBhc3NvY2lhdGVkXG4gIHdpdGggYW4gb3B0aW9uYWwgc2V0IG9mIHJvbGVzLlxuICBcIlwiXCJcbiAgZGlyZWN0aXZlIEByZXF1aXJlQXV0aChyb2xlczogW1N0cmluZ10pIG9uIEZJRUxEX0RFRklOSVRJT05cbmBcblxuY29uc3QgdmFsaWRhdGUgPSAoeyBkaXJlY3RpdmVBcmdzIH0pID0+IHtcbiAgY29uc3QgeyByb2xlcyB9ID0gZGlyZWN0aXZlQXJnc1xuICBhcHBsaWNhdGlvblJlcXVpcmVBdXRoKHsgcm9sZXMgfSlcbn1cblxuY29uc3QgcmVxdWlyZUF1dGggPSBjcmVhdGVWYWxpZGF0b3JEaXJlY3RpdmUoc2NoZW1hLCB2YWxpZGF0ZSlcblxuZXhwb3J0IGRlZmF1bHQgcmVxdWlyZUF1dGhcbiJdLCJtYXBwaW5ncyI6IkFBRUEsU0FBU0Esd0JBQXdCLFFBQVEsMkJBQTJCO0FBRXBFLFNBQVNDLFdBQVcsSUFBSUMsc0JBQXNCO0FBRTlDLE9BQU8sTUFBTUMsTUFBTTtFQUFBO0VBQUE7SUFBQTtJQUFBO01BQUE7TUFBQTtNQUFBO0lBQUE7SUFBQTtNQUFBO01BQUE7SUFBQTtJQUFBO01BQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTtNQUFBO1FBQUE7UUFBQTtVQUFBO1VBQUE7WUFBQTtZQUFBO1VBQUE7UUFBQTtNQUFBO01BQUE7SUFBQTtJQUFBO0lBQUE7TUFBQTtNQUFBO0lBQUE7RUFBQTtFQUFBO0lBQUE7SUFBQTtJQUFBO01BQUE7TUFBQTtNQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7RUFBQTtBQUFBLENBTWxCO0FBRUQsTUFBTUMsUUFBUSxHQUFHLENBQUM7RUFBRUM7QUFBYyxDQUFDLEtBQUs7RUFDdEMsTUFBTTtJQUFFQztFQUFNLENBQUMsR0FBR0QsYUFBYTtFQUMvQkgsc0JBQXNCLENBQUM7SUFBRUk7RUFBTSxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUVELE1BQU1MLFdBQVcsR0FBR0Qsd0JBQXdCLENBQUNHLE1BQU0sRUFBRUMsUUFBUSxDQUFDO0FBRTlELGVBQWVILFdBQVcifQ==