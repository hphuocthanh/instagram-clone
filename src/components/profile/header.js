import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { RoughNotation } from 'react-rough-notation';
import useUser from '../../hooks/use-user';
import { isUserFollowingProfile, toggleFollow } from '../../services/firebase';
import UserContext from '../../context/user';

export default function Header({
  photosCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    following,
    username: profileUsername,
    followers
  },
  followerCount,
  setFollowerCount
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);

  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const activeBtnFollow = user && user.username && user.username !== profileUsername;

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(user.username, profileUserId);
      setIsFollowingProfile(!!isFollowing);
    };

    if (user?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [user?.username, profileUserId]);

  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1
    });
    await toggleFollow(isFollowingProfile, user.docId, profileDocId, profileUserId, user.userId);
  };
  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center items-center">
        {profileUsername ? (
          <img
            className="rounded-full h-16 w-16 md:h-20 md:w-20 lg:h-40 lg:w-40 flex"
            alt={`${profileUsername} profile`}
            src={`/images/avatars/${
              profileUsername === 'hphuocthanh' ||
              profileUsername === 'chanh308' ||
              profileUsername === 'ldwook' ||
              profileUsername === 'bink'
                ? profileUsername
                : `cat`
            }.jpg`}
          />
        ) : (
          <Skeleton count={1} width={64} height={64} circle />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-3xl font-light mr-4">
            <RoughNotation type="underline" show animationDelay={3000}>
              {profileUsername}
            </RoughNotation>
          </p>
          {activeBtnFollow && (
            <button
              type="button"
              className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
              onClick={handleToggleFollow}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleToggleFollow();
                }
              }}
            >
              {isFollowingProfile ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        <div className="container flex mt-4 flex-row">
          {!followers || !following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-semibold">{photosCount}</span>{' '}
                {photosCount === 1 ? 'photo' : 'photos'}
              </p>
              <p className="mr-10">
                <span className="font-semibold">{followerCount}</span>{' '}
                {followerCount === 1 ? 'follower' : 'followers'}
              </p>
              <p className="mr-10">
                <span className="font-semibold">{following.length}</span> following
              </p>
            </>
          )}
        </div>
        <div className="container mt-4">
          <p className="font-medium">{!fullName ? <Skeleton count={1} height={24} /> : fullName}</p>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  photosCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    following: PropTypes.array,
    followers: PropTypes.array,
    username: PropTypes.string
  }).isRequired
};
