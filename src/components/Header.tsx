import { createMemo, Show } from "solid-js";
import { A, useLocation } from "solid-start";
import { useSession } from "~/session";

type NavItemProps = {
  label: string
  href: string
  icon?: string
}

function NavItem(props: NavItemProps) {
  const location = useLocation();

  return (
    <li class="nav-item">
      <A
        classList={{
          "nav-link": true,
          "active": props.href === location.pathname
        }}
        href={props.href}>
        <Show when={props.icon}>
          <i class={props.icon}></i>&nbsp;
        </Show>{props.label}
      </A>
    </li>
  )
}

export default function Header() {
  const session = useSession();
  const location = useLocation();
  const userHref = createMemo(() => {
    return session.user() ?
      `/profile/${session.user().username}`
      : ""
  })

  return (
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="index.html">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          <NavItem label="Home" href="/" />
          <Show when={session.user()}>
            <NavItem label="New Article" href="/editor" icon="ion-compose" />
            <NavItem label="Settings" href="/settings" icon="ion-gear-a" />
          </Show>
          <Show when={session.user() === null}>
            <NavItem label="Sign in" href="/login" />
            <NavItem label="Sign up" href="/register" />
          </Show>
          <Show when={session.user()}>
            <li class="nav-item">
              <A
                classList={{
                  "nav-link": true,
                  "active": userHref() === location.pathname
                }}
                href={`/profile/${session.user().username}`}>
                <img class="user-pic" src={session.user().image} />{session.user().username}
              </A>
            </li>
          </Show>
        </ul>
      </div>
    </nav>
  )
}