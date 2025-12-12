export default function FaleConosco() {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Fale Conosco</h2>
        <p className="text-gray-600 mb-12">
          Precisa de ajuda? Entre em contato com nosso time.
        </p>

        {/* Cards de Contato */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* WhatsApp */}
          <div className="p-6 rounded-2xl shadow-md border hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
            <p className="text-gray-600 mb-4">
              Converse com a gente pelo WhatsApp.
            </p>
            <a
              href="https://wa.me/5599999999999"
              target="_blank"
              className="inline-block bg-green-500 text-white px-5 py-2 rounded-xl font-medium hover:bg-green-600 transition"
            >
              Abrir WhatsApp
            </a>
          </div>

          {/* Email */}
          <div className="p-6 rounded-2xl shadow-md border hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">E-mail</h3>
            <p className="text-gray-600 mb-4">
              Prefere enviar um e-mail? Responderemos o mais rápido possível.
            </p>
            <a
              href="mailto:contato@placyhub.com"
              className="inline-block bg-blue-500 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-600 transition"
            >
              Enviar E-mail
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
