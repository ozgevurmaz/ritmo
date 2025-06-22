import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '@/lib/utils';
import clsx from 'clsx';

type ProfilePhotoProps = {
  profile: UserType;
  size?: 'xs' | 'sm' | 'md' | 'lg' ;
  className?: string;
};

const sizeMap = {
  xs: 'h-7 w-7 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-lg',
  lg: 'h-14 w-14 text-2xl',
};

const ProfilePhoto = ({ profile, size = 'xs', className }: ProfilePhotoProps) => {
  const classes = clsx(sizeMap[size], className);

  return (
    <Avatar className={classes}>
      {profile?.avatar ? (
        <AvatarImage src={profile.avatar} alt={profile.name || 'User'} />
      ) : (
        <AvatarFallback className="bg-primary/20 text-primary">
          {getInitials(profile.name || 'My Ritmo')}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default ProfilePhoto;
