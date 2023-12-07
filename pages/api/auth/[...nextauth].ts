import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
const handler = NextAuth({
    providers: [
        CredentialsProvider({

            name: "Credentials",
            credentials: {
                id_token: { label: "id_token", type: "text" },
            },
            async authorize(credentials, req) {

               

                // const user = await res.json();
                const user = '';

                if (user) {
                    return user;
                } else {
                    return null;

                }
            },
        }),
    ],
    callbacks: {

        async session({ session, token }) {
            session.user = token as any;
            return session;
        },
    },
});

export default handler;
