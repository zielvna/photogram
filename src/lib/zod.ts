import * as z from 'zod';

export const usernameZod = z
    .string()
    .min(4, { message: 'Username is too short.' })
    .max(16, { message: 'Username is too long.' });

export const emailZod = z.string().email('Invalid e-mail address.');

export const passwordZod = z
    .string()
    .min(6, { message: 'Password is too short.' })
    .max(32, { message: 'Password is too long.' });

export const descriptionZod = z.string().trim().max(200, { message: 'Description is too long.' });

export const commentZod = z
    .string()
    .trim()
    .min(1, { message: 'Comment is too short.' })
    .max(100, { message: 'Comment is too long.' });

export const bioZod = z.string().trim().max(200, { message: 'Bio is too long.' });
