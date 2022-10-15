import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import { A, createRouteAction } from "solid-start";
import Page from "~/components/Page";
import { NewUserRequest } from "~/generated/Api";
import { api, errorMessage } from "../realworlddemo";

export default function Register() {
  const register = async (formData: FormData) => {
    const request: NewUserRequest = {
      user: {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      }
    };
    const result = await api.users.createUser(request)
    api.setSecurityData({ token: result.data.user.token })
    navigate("/")
  }

  const [registering, { Form }] = createRouteAction(register);
  const navigate = useNavigate();

  return (
    <Page>
      <div class="auth-page">
        <div class="container page">
          <div class="row">

            <div class="col-md-6 offset-md-3 col-xs-12">
              <h1 class="text-xs-center">Sign up</h1>
              <p class="text-xs-center">
                <A href="/login">Have an account?</A>
              </p>

              <Show when={registering.error}>
                <ul class="error-messages">
                  <li>{errorMessage(registering.error)}</li>
                </ul>
              </Show>

              <Form>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="text" placeholder="Your Name" name="username" />
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="text" placeholder="Email" name="email" />
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="password" placeholder="Password" name="password" />
                </fieldset>
                <button
                  class="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={registering.pending}>
                  Sign up
                </button>
              </Form>
            </div>

          </div>
        </div>
      </div>
    </Page >
  )
}