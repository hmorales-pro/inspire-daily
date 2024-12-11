import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { BackButton } from '@/components/auth/AuthProviderButton';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const redirectTo = `${window.location.origin}`;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/home', { replace: true });
      }
      if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Réinitialisation du mot de passe",
          description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <AuthContainer>
      <BackButton />
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
          redirectTo={redirectTo}
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
    </AuthContainer>
  );
};

export default Login;