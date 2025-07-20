import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

type IconProps = {
  size?: number;
  color?: string;
};

export const Phone: React.FC<IconProps> = (props) => <Ionicons name="call" {...props} />;
export const Mail: React.FC<IconProps> = (props) => <Ionicons name="mail" {...props} />;
export const Info: React.FC<IconProps> = (props) => <Ionicons name="information-circle" {...props} />;