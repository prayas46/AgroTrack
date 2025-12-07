
'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/firebase/auth-provider';


function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Creating Account...' : 'Create an account'}
        </Button>
    );
}

export default function SignupPage() {
    const { signup, user, isUserLoading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const loginHeroImage = PlaceHolderImages.find((img) => img.id === 'login-hero');
    
    useEffect(() => {
        if (!isUserLoading && user) {
            router.push('/dashboard');
        }
    }, [user, isUserLoading, router]);

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'Signup Failed',
                description: 'Passwords do not match.',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await signup(email, password, name);
            toast({
                title: 'Success!',
                description: "Your account has been created successfully.",
            });
            router.push('/dashboard');
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Signup Failed',
                description: error.message || 'An unknown error occurred.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isUserLoading || user) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
             <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                         <Logo className="justify-center mb-2" />
                        <h1 className="text-3xl font-bold">Sign Up</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your information to create an account
                        </p>
                    </div>
                     <form onSubmit={handleSignup} className="grid gap-4">
                         <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                                id="name" 
                                name="name" 
                                placeholder="John Doe" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                name="password" 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                type="password" 
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <SubmitButton isSubmitting={isSubmitting} />
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="underline">
                            Login
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
