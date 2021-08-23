import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { RoughNotation } from 'react-rough-notation';
import Photo from './photo';

export default function Photos({ photos }) {
  return (
    <div className="h-16 border-t border-gray-primary mt-12 px-4 lg:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 mb-12">
        {!photos ? (
          <>
            <Skeleton count={12} width={320} height={400} />
          </>
        ) : photos.length > 0 ? (
          photos.map((photo, index) => <Photo key={photo.docId} photo={photo} index={index} />)
        ) : (
          <h2 className="text-center col-span-3">
            Oh no photos...{' '}
            <RoughNotation type="highlight" show animationDelay={2000} color="yellow">
              It's okay
            </RoughNotation>
            , graphic records of memories don't determine{' '}
            <RoughNotation type="circle" show animationDelay={4000} color="pink">
              happiness
            </RoughNotation>{' '}
            at all.{' '}
            <small className="block mt-2 text-gray-base">
              <RoughNotation type="box" show animationDelay={6000} color="orange">
                Stay healthy 🖤.
              </RoughNotation>
            </small>
          </h2>
        )}
      </div>
    </div>
  );
}

Photos.propTypes = {
  photos: PropTypes.array.isRequired
};
