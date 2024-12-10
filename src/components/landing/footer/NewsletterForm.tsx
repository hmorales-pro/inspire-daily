import { Button } from "@/components/ui/button";

export const NewsletterForm = () => {
  return (
    <form className="mt-4">
      <input
        type="email"
        placeholder="Votre email"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
      />
      <Button
        type="submit"
        className="mt-2 w-full"
      >
        S'abonner
      </Button>
    </form>
  );
};