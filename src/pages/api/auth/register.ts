import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from "bcrypt";
import { generateToken } from '@/services/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { email, password, name, whatsapp } = req.body;
    console.log("Recebendo requisição de registro:", req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Senha original:", password);
    console.log("Hash gerado:", hashedPassword);


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      whatsapp,
      role: 'user'
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }});
  } catch (error) {
    res.status(500).json(error);
  }
}