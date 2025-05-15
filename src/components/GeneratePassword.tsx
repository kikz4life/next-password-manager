import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {RefreshCcw} from "lucide-react";
import {useEffect, useState} from "react";
import {GenerateNewPassword} from "@/lib/GenerateNewPassword"

interface GeneratePasswordProps {
  show: boolean;
  sendPassword: (password: string) => void;
}
const GeneratePassword = ({show, sendPassword}: GeneratePasswordProps) => {

  const [generatedPassword, setGeneratedPassword] = useState("");

  const useGeneratedPassword = () => {
    sendPassword(generatedPassword);
  };

  const handleGenerateNewPassword = () => {
    const newPassword = GenerateNewPassword();
    setGeneratedPassword(newPassword);
  };

  useEffect(() => {
    const newGeneratedPassword = GenerateNewPassword();
    setGeneratedPassword(newGeneratedPassword)
  }, []);

  if (!show) return null;

  return (

      <div>
        <div className="flex items-center gap-2 mt-2">
          <Input
            type="text"
            placeholder="Generated Password"
            value={generatedPassword}
            readOnly
            className="flex-1"
          />
          <Button type="button" variant="outline" size="icon"
                  onClick={handleGenerateNewPassword}
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button type="button"
                  onClick={useGeneratedPassword}
          >
            Use this password
          </Button>
        </div>
      </div>
  );
};

export default GeneratePassword;