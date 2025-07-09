import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import clsx from 'clsx';
import { getInitials } from '@/lib/utils/user/getDefaultAvatar';

type ProfilePhotoProps = {
  name?: string | null;
  avatarUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap = {
  xs: 'h-7 w-7 text-xs font-bold',
  sm: 'h-8 w-8 text-sm font-bold',
  md: 'h-10 w-10 text-lg font-bold',
  lg: 'h-14 w-14 text-2xl font-bold',
};

const ProfilePhoto = ({ size = 'xs', className, name, avatarUrl }: ProfilePhotoProps) => {
  const classes = clsx(sizeMap[size], className);

  return (
    <Avatar className={classes}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={name || 'User'} />
      ) : (
        <AvatarFallback className="bg-primary/20 text-primary">
          {getInitials(name || 'My Ritmo')}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default ProfilePhoto;
