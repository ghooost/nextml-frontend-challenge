import { useState } from 'react';
import { ImageCommentWithLocal } from '../../store/images';

import styles from './styles.module.css';

interface CommentItemProps {
  comment: ImageCommentWithLocal;
  scale: number;
  onSave: (comment: ImageCommentWithLocal) => void;
}

export const CommentItem = ({ comment, scale, onSave }: CommentItemProps) => {
  const { text: initialText, x, y } = comment;
  const [text, setText] = useState(initialText);
  const [isEdit, SetIsEdit] = useState(false);

  const handleChange = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    setText(event.currentTarget.value);
  };

  const handleBlur = () => {
    SetIsEdit(false);
    onSave({ ...comment, text });
  };

  const handleClick = () => {
    SetIsEdit(true);
  };

  return (
    <div className={styles.comment} style={{ transform: `translate(${x * scale}px, ${y * scale}px)` }}>
      {isEdit === true && (
        <textarea autoFocus value={text} className={styles.textarea} onChange={handleChange} onBlur={handleBlur} />
      )}
      <div className={styles.textfield} onClick={handleClick}>
        {text}
      </div>
    </div>
  );
};
