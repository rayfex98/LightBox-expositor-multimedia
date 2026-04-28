// Configuración de credenciales de Supabase
// Las variables SUPABASE_URL y SUPABASE_KEY provienen de config.js,
// el cual no se subirá a GitHub gracias al archivo .gitignore
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;

// Inicializar el cliente de Supabase usando el CDN global
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Desestructurar métodos de Vue
const { createApp, ref, onMounted } = Vue;

// Crear la aplicación de Vue
createApp({
    setup() {
        // Estado reactivo
        const productos = ref([]);
        const loading = ref(true);
        const error = ref(null);

        // Función para recuperar datos de la base
        const fetchProductos = async () => {
            try {
                loading.value = true;
                error.value = null;

                // Consulta a la tabla "productos"
                const { data, error: supabaseError } = await supabaseClient
                    .from('productos')
                    .select('*');

                if (supabaseError) throw supabaseError;

                // Guardar los datos recuperados
                productos.value = data;
                
            } catch (err) {
                console.error("Error al cargar productos:", err);
                error.value = "Ocurrió un error al cargar los productos: " + err.message;
            } finally {
                loading.value = false;
            }
        };

        // Ejecutar la función cuando el componente esté listo
        onMounted(() => {
            fetchProductos();
        });

        // Retornar las variables al template (consulta.html)
        return {
            productos,
            loading,
            error
        };
    }
}).mount('#app');
