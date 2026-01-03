
import { useWindowStore } from "../../store/windowStore";
import { useTheme } from "../../components/Window";

export const Browser: React.FC = () => {
  const theme = useTheme();
  const { windows, activeInstanceId } = useWindowStore();
  const isDark = theme === 'dark';

  return (
    <div className={`w-full h-full flex flex-col ${isDark ? 'bg-black' : 'bg-white'}`}>
      <iframe 
        src="https://www.bing.com" 
        className={`flex-1 w-full border-none ${isDark ? 'grayscale invert contrast-125 brightness-75' : ''}`}
        title="Browser"
      />
    </div>
  );
};
