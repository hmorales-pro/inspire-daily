import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUrl = window.location.origin;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        window.location.href = `${currentUrl}/home`;
      }
      if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Réinitialisation du mot de passe",
          description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
        });
      }
    });

    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = `${currentUrl}/home`;
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-primary-light p-4">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-primary hover:text-primary/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-primary-dark mb-8">
            Connexion
          </h1>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#333333',
                  }
                }
              }
            }}
            theme="light"
            providers={['google']}
            redirectTo={`${currentUrl}/home`}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Mot de passe',
                  email_input_placeholder: 'Votre email',
                  password_input_placeholder: 'Votre mot de passe',
                  button_label: 'Se connecter',
                  loading_button_label: 'Connexion en cours...',
                  social_provider_text: 'Se connecter avec {{provider}}',
                  link_text: "Vous n'avez pas de compte ? Inscrivez-vous"
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Mot de passe',
                  email_input_placeholder: 'Votre email',
                  password_input_placeholder: 'Votre mot de passe',
                  button_label: "S'inscrire",
                  loading_button_label: 'Inscription en cours...',
                  social_provider_text: "S'inscrire avec {{provider}}",
                  link_text: "Vous avez déjà un compte ? Connectez-vous"
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;