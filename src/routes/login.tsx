import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import { A, createRouteAction } from "solid-start";
import Page from "~/components/Page";
import { LoginUserRequest } from "~/generated/Api";
import { useSession } from "~/session";
import { api, errorMessage } from "../realworlddemo";

export default function Login() {
  const login = async (formData: FormData) => {
    const request: LoginUserRequest = {
      user: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      }
    }
    const response = await api.users.login(request)
    useSession().actions.newSession(response.data.user)
    navigate("/");
  }

  const navigate = useNavigate();
  const [loggingIn, { Form }] = createRouteAction(login);

  return (
    <Page>
      <div class="auth-page">
        <div class="container page">
          <div class="row">
            <div class="col-md-6 offset-md-3 col-xs-12">
              <h1 class="text-xs-center">Login</h1>
              <p class="text-xs-center">
                <A href="/register">Don't have an account?</A>
              </p>

              <Show when={loggingIn.error}>
                <ul class="error-messages">
                  <li>{errorMessage(loggingIn.error)}</li>
                </ul>
              </Show>

              <Form>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="text" placeholder="Email" name="email" />
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="password" placeholder="Password" name="password" />
                </fieldset>
                <button
                  class="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={loggingIn.pending}>
                  Login
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}