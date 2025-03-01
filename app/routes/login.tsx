import { data, Link, redirect } from "react-router";
import type { Route } from "./+types/login";
import {
    getSession,
    commitSession,
} from "~/utils/session.server";
import db from "~/db";

export async function loader({
    request,
}: Route.LoaderArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    );

    if (session.has("userId")) {
        // Redirect to the home page if they are already signed in.
        return redirect("/");
    }

    return data(
        { error: session.get("error") },
        {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        }
    );
}

export async function action({
    request,
}: Route.ActionArgs) {
    try {
        const session = await getSession(
            request.headers.get("Cookie")
        );
        const form = await request.formData();
        const username = form.get("username");
        const password = form.get("password");

        if (!username || !password) {
            session.flash("error", "Username and password are required");
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            });
        }

        // First check if user exists
        const existingUser = await db.query.usersTable.findFirst({
            where: (users, { eq }) => eq(users.name, String(username))
        });

        if (!existingUser) {
            session.flash("error", "Invalid username/password");
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            });
        }

        // TODO: Add password verification here
        // const isValidPassword = await verifyPassword(password, existingUser.hashedPassword);
        // if (!isValidPassword) {
        //     session.flash("error", "Invalid username/password");
        //     return redirect("/login", {...});
        // }

        session.set("userId", existingUser.id);

        return redirect("/", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        const session = await getSession(
            request.headers.get("Cookie")
        );
        session.flash("error", "An error occurred during login");
        return redirect("/login", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }
}

export default function Login({
    loaderData,
}: Route.ComponentProps) {
    const { error } = loaderData;

    return (
        <div>
            {error ? <div className="error">{error}</div> : null}
            <form method="POST">
                <div>
                    <p>Please sign in</p>
                </div>
                <label>
                    Username: <input type="text" name="username" />
                </label>
                <label>
                    Password:{" "}
                    <input type="password" name="password" />
                </label>

                <button type="submit">Submit</button>
            </form>

            <h1>New User ? </h1>
            <Link to={"/signup"}>SignUp</Link>
        </div>
    );
}
