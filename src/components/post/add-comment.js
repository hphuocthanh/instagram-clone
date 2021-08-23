import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import FirebaseContext from '../../context/firebase';
import UserContext from '../../context/user';

export default function AddComment({ docId, comments, setComments, commentInput }) {
  const [comment, setComment] = useState('');
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const {
    user: { displayName }
  } = useContext(UserContext);

  const handleSubmitComment = (e) => {
    e.preventDefault();

    setComments([...comments, { displayName, comment }]); // give a new array with these and put new comment in the old comments -> new comments with updated comments
    setComment('');

    return firebase
      .firestore()
      .collection('photos')
      .doc(docId)
      .update({
        comments: FieldValue.arrayUnion({ displayName, comment })
      });
  };

  return (
    <div className="border-t border-gray-primary">
      <form
        data-testid={`add-comment-submit-${docId}`}
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={(e) => (comment.length >= 1 ? handleSubmitComment(e) : e.preventDefault())}
      >
        <input
          data-testid={`add-comment-${docId}`}
          aria-label="Add a comment"
          autocomplet="off"
          className="text-xs text-gray-base w-full mr-3 py-5 mx-4 focus:outline-none"
          type="text"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          type="button"
          className={`text-xs font-bold text-blue-medium disabled:cursor-not-allowed ${
            !comment && `opacity-50`
          }`}
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

AddComment.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  setComments: PropTypes.func.isRequired,
  commentInput: PropTypes.object.isRequired
};
