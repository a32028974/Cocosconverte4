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

      const { data: { text } } = await Tesseract.recognize(e.target.result, 'eng', {
        tessedit_char_whitelist: '0123456789.,'
      });

      const numero = parseFloat(text.replace(',', '.').match(/[\d.]+/));
      if (isNaN(numero)) {
        resultado.innerText = "No se pudo leer el número.";
      } else {
        const enPesos = Math.round(numero * cotizacion);
        resultado.innerText = `R$${numero.toFixed(2)} = $${enPesos.toLocaleString()} ARS`;
      }

      procesando.innerText = "";
    };
    reader.readAsDataURL(file);
  }
});
