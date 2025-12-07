
'use client';

import { useAuth } from '@/firebase/auth-provider';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Calendar as CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  const { user, userProfile, isUserLoading } = useAuth();
  const profileHeaderImage = PlaceHolderImages.find((img) => img.id === 'profile-header');

  if (isUserLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const userInitials = user.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('')
    : 'U';

  const registrationDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : 'N/A';

  return (
    <div className="space-y-8">
      <PageHeader title="User Profile" description="View and manage your account details." />

      {profileHeaderImage && (
         <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-lg border group">
            <Image
                src={profileHeaderImage.imageUrl}
                alt={profileHeaderImage.description}
                fill
                className="object-cover"
                data-ai-hint={profileHeaderImage.imageHint}
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 flex flex-col items-center md:items-start space-y-4">
           <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-center md:text-left">{user.displayName}</h2>
              <p className="text-muted-foreground text-center md:text-left">{user.email}</p>
            </div>
             {userProfile?.role && (
                <Badge variant="secondary">{userProfile.role}</Badge>
            )}
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Details associated with your AgroTrack account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                            <p className="font-semibold">{user.displayName}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                            <p className="font-semibold">{user.email}</p>
                        </div>
                    </div>
                    {userProfile?.role && (
                         <div className="flex items-center gap-4">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Role</p>
                                <p className="font-semibold">{userProfile.role}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                            <p className="font-semibold">{registrationDate}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
