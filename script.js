document.getElementById('imagen').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const img = document.getElementById('preview');
  const procesando = document.getElementById('procesando');
  const resultado = document.getElementById('resultado');
  const cotizacion = parseFloat(document.getElementById('cotizacion').value);

  resultado.innerText = "";
  procesando.innerText = "Procesando imagen...";

  if (file) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      img.src = e.target.result;

      const { data: { text } } = await Tesseract.recognize(e.target.result, 'por', {
        tessedit_char_whitelist: '0123456789.,'
      });

      // 🧠 Buscar el primer número decimal
      const match = text.match(/(\d{1,3}[.,]\d{2})/);
      
      if (!match) {
        resultado.innerText = "No se pudo leer ningún precio.";
        procesando.innerText = "";
        return;
      }

      // 📌 Convertir a número flotante
      let numero = match[1].replace(',', '.');
      numero = parseFloat(numero);

      if (isNaN(numero)) {
        resultado.innerText = "El texto no contiene un número válido.";
      } else {
        const enPesos = Math.round(numero * cotizacion);
        resultado.innerText = `R$${numero.toFixed(2)} = $${enPesos.toLocaleString()} ARS`;
      }

      procesando.innerText = "";
    };
    reader.readAsDataURL(file);
  }
});
