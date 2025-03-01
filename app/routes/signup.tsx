import { commitSession, getSession } from "~/utils/session.server";
import type { Route } from "./+types/signup";
import { data, Form, Link, redirect } from "react-router";
import db from "~/db";
import { usersTable } from "~/db/schema";


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
            const newUser = await db.insert(usersTable).values({
                name: String(username)
            }).returning()

            console.log("new user")

            session.set("userId", newUser[0].id);
        } else {
            console.log("old user")

            session.set("userId", existingUser.id);
        }

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



export default function SignUp() {
    return (
        <div>
            <Form method="post">
                <div>
                    <p>Please Sign Up</p>
                </div>
                <label>
                    Username: <input type="text" name="username" />
                </label>
                <label>
                    Password:{" "}
                    <input type="password" name="password" />
                </label>

                <button type="submit">Submit</button>
            </Form>

            <h1>Already a User ? </h1>
            <Link to={"/login"}>SignUp</Link>
        </div>
    )
}
