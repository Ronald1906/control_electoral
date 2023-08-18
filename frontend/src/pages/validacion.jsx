import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Validacion = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND + 'usuarios/login', {
          headers: {
            token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app'),
          },
        });

        const userRole = response.data.token.data.id_rol;

        if (userRole === 1) {
          router.push('/dashboard');
        } else if (userRole === 2) {
          router.push('/usuarios');
        } else if (userRole === 3) {
          router.push('/recintos_supervisor');
        } else if (userRole === 4) {
          router.push('/inicio');
        }
      } catch (error) {
        // Manejo de errores, por ejemplo, redirigir a una página de error
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [router]);

  return null; // Opcionalmente, puedes devolver algún indicador de carga
};

export default Validacion;
