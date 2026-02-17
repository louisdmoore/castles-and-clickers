import Tooltip from './Tooltip';
import { QuestionIcon } from '../icons/ui';

const HelpTooltip = ({ content, position = 'bottom' }) => (
  <Tooltip content={content} position={position}>
    <button
      type="button"
      className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500/50 bg-blue-900/30 hover:bg-blue-800/50 transition-colors"
      aria-label="Help"
    >
      <QuestionIcon size={14} />
    </button>
  </Tooltip>
);

export default HelpTooltip;
