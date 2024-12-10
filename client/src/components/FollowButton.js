import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../redux/followSlice';

function FollowButton({ targetUserId }) {
  const dispatch = useDispatch();
  const following = useSelector((state) => state.follow.following);

  const isFollowing = following.includes(targetUserId);

  const handleFollow = () => {
    isFollowing
      ? dispatch(unfollowUser(targetUserId))
      : dispatch(followUser(targetUserId));
  };

  return (
    <button onClick={handleFollow}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}

export default FollowButton;
