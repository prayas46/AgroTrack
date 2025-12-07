
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

const initialState = {
    message: '',
    success: false,
    errors: {},
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Logging in...' : 'Login'}
        </Button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useActionState(login, initialState);
    const { toast } = useToast();
    const router = useRouter();

    const loginHeroImage = PlaceHolderImages.find((img) => img.id === 'login-hero');

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({
                    title: 'Success!',
                    description: state.message,
                });
                router.push('/dashboard');
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Login Failed',
                    description: state.message,
                });
            }
        }
    }, [state, toast, router]);

    return (
        <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <Logo className="justify-center mb-2" />
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <form action={formAction} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="m@example.com"
                                required
                            />
                            {state.errors?.email && (
                                <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input id="password" name="password" type="password" required />
                             {state.errors?.password && (
                                <p className="text-sm font-medium text-destructive">{state.errors.password[0]}</p>
                            )}
                        </div>
                        <SubmitButton />
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative">
                {loginHeroImage && (
                    <Image
                        src={loginHeroImage.imageUrl}
                        alt={loginHeroImage.description}
                        fill
                        className="object-cover dark:brightness-[0.3] dark:grayscale"
                        data-ai-hint={loginHeroImage.imageHint}
                    />
                )}
            </div>
        </div>
    );
}

    