import { memo } from 'react';
import StableTextarea from './StableTextarea';

// Isolated input components to prevent re-renders
export const ReplyTextarea = memo(({ value, onChange, loading, placeholder }) => (
  <StableTextarea
    value={value}
    onChange={onChange}
    loading={loading}
    placeholder={placeholder}
    rows={2}
    maxLength={500}
    id="reply-textarea"
    name="reply-textarea"
    className="w-full rounded px-3 py-2 border border-pastel-blue text-sm font-opendyslexic disabled:opacity-50 resize-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent"
  />
));

export const PostTextarea = memo(({ value, onChange, loading, placeholder }) => (
  <StableTextarea
    value={value}
    onChange={onChange}
    loading={loading}
    placeholder={placeholder}
    rows={3}
    maxLength={500}
    id="post-textarea"
    name="post-textarea"
    className="w-full rounded-lg px-4 py-3 border-2 border-pastel-mint focus:ring-4 focus:ring-pastel-blue text-lg font-opendyslexic disabled:opacity-50 resize-none"
  />
));

export const CharacterCount = memo(({ count, max }) => (
  <div className="text-sm text-gray-500 mt-2 text-right">
    {count}/{max} characters
  </div>
));

export const ReplyCharacterCount = memo(({ count, max }) => (
  <div className="text-xs text-gray-500 mt-1 text-right">
    {count}/{max}
  </div>
)); 