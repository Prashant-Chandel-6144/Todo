import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      await connectDB();
      console.log(user);
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const name = user.name.split(" ");
        const newUser = new User.create({
          fname: name[0],
          lname: name[1] || "",
          email: user.email,
          image: user.image,
        });
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
