import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/login",   // ← ADD THIS
  },

  callbacks: {
    async signIn({ user }) {
      await connectDB();
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const name = user.name.split(" ");
        await User.create({
          fname: name[0],
          lname: name[1] || "",
          email: user.email,
          image: user.image,
        });
      }
      return true;
    },

    async redirect({ url, baseUrl }) {   // ← ADD THIS
      return baseUrl + "/todos";
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };