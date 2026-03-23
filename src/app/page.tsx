import DiffChecker from "../components/DiffChecker";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", padding: "2rem 1rem", maxWidth: "960px", margin: "0 auto" }}>
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-text)", marginBottom: "0.5rem" }}>
          Diff Checker — Comparador de Texto
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Compara dos textos línea a línea y resalta las diferencias. Sin registro, 100% en el navegador.
        </p>
      </header>

      <div style={{ background: "var(--color-surface)", borderRadius: "1rem", border: "1px solid var(--color-border)", padding: "1.5rem", marginBottom: "2rem" }}>
        <DiffChecker />
      </div>

      {/* Cómo usar */}
      <section style={{ marginBottom: "2rem", background: "var(--color-surface)", borderRadius: "1rem", border: "1px solid var(--color-border)", padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-text)", marginBottom: "1rem" }}>
          Cómo usar / How to use
        </h2>
        <ol style={{ paddingLeft: "1.25rem", color: "var(--color-text-muted)", lineHeight: "2" }}>
          <li>
            <strong style={{ color: "var(--color-text)" }}>Pega el texto original</strong> en el campo izquierdo («Original»). Puede ser código, documentación, JSON, o cualquier texto plano.
          </li>
          <li>
            <strong style={{ color: "var(--color-text)" }}>Pega el texto modificado</strong> en el campo derecho («Modificado»). Puede tener líneas añadidas, eliminadas o iguales.
          </li>
          <li>
            <strong style={{ color: "var(--color-text)" }}>Visualiza el diff en tiempo real</strong>: las líneas añadidas se muestran en verde (+), las eliminadas en rojo (−) y las sin cambios en gris.
          </li>
          <li>
            <strong style={{ color: "var(--color-text)" }}>Descarga el resultado</strong> como archivo <code style={{ background: "var(--color-border)", padding: "0 4px", borderRadius: "3px" }}>.diff</code> o cópialo al portapapeles con un solo clic.
          </li>
        </ol>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: "2rem", background: "var(--color-surface)", borderRadius: "1rem", border: "1px solid var(--color-border)", padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-text)", marginBottom: "1rem" }}>
          Preguntas frecuentes / FAQ
        </h2>

        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ color: "var(--color-text)", fontWeight: "600", marginBottom: "0.25rem" }}>
            ¿Qué es un diff?
          </h3>
          <p style={{ color: "var(--color-text-muted)", lineHeight: "1.6" }}>
            Un «diff» es la diferencia entre dos versiones de un texto. Muestra exactamente qué líneas han sido añadidas, eliminadas o permanecen sin cambios entre la versión original y la modificada. Es una herramienta fundamental en el desarrollo de software para revisar cambios en código.
          </p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ color: "var(--color-text)", fontWeight: "600", marginBottom: "0.25rem" }}>
            ¿Qué significan los colores verde y rojo?
          </h3>
          <p style={{ color: "var(--color-text-muted)", lineHeight: "1.6" }}>
            Las líneas en <strong style={{ color: "#6ee7b7" }}>verde (+)</strong> son líneas nuevas que aparecen en el texto modificado pero no en el original. Las líneas en <strong style={{ color: "#fca5a5" }}>rojo (−)</strong> son líneas que existían en el original pero han sido eliminadas. Las líneas en gris sin prefijo son idénticas en ambos textos.
          </p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ color: "var(--color-text)", fontWeight: "600", marginBottom: "0.25rem" }}>
            ¿Puedo comparar código fuente?
          </h3>
          <p style={{ color: "var(--color-text-muted)", lineHeight: "1.6" }}>
            Sí, el comparador funciona con cualquier texto plano: código JavaScript, Python, HTML, CSS, JSON, YAML, Markdown, archivos de configuración, documentos de texto, etc. El algoritmo LCS (Longest Common Subsequence) garantiza un diff preciso e idéntico al que genera Git.
          </p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ color: "var(--color-text)", fontWeight: "600", marginBottom: "0.25rem" }}>
            ¿Hay un límite de tamaño?
          </h3>
          <p style={{ color: "var(--color-text-muted)", lineHeight: "1.6" }}>
            La herramienta soporta hasta 5.000 líneas por texto para garantizar un rendimiento fluido en el navegador. Si necesitas comparar textos más grandes, te recomendamos usar Git diff en tu terminal local o dividir el contenido en fragmentos más pequeños.
          </p>
        </div>

        <div>
          <h3 style={{ color: "var(--color-text)", fontWeight: "600", marginBottom: "0.25rem" }}>
            ¿Mi texto se envía a algún servidor?
          </h3>
          <p style={{ color: "var(--color-text-muted)", lineHeight: "1.6" }}>
            No. Todo el procesamiento ocurre íntegramente en tu navegador. No se envía ningún dato a ningún servidor externo. Puedes incluso usar la herramienta sin conexión a internet una vez que la página ha cargado. Tu texto nunca abandona tu dispositivo.
          </p>
        </div>
      </section>

      {/* Embed */}
      <section style={{ background: "var(--color-surface)", borderRadius: "1rem", border: "1px solid var(--color-border)", padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-text)", marginBottom: "0.5rem" }}>
          Embed on your website
        </h2>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem", fontSize: "0.875rem" }}>
          Embed this Diff Checker on any website using an iframe — no installation required.
        </p>
        <pre style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "0.5rem", padding: "1rem", overflowX: "auto", fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: "1.6" }}>
{`<iframe
  src="https://miguelacm.es/embed/diff-checker"
  width="100%"
  height="700"
  style="border:none;border-radius:12px;"
  title="Diff Checker — miguelacm.es"
  loading="lazy"
></iframe>`}
        </pre>
        <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          💡 Consider adding a link attribution:{" "}
          <a href="https://miguelacm.es/tools/diff-checker" style={{ color: "var(--color-primary)" }}>
            Diff Checker by MACM
          </a>
        </p>
      </section>
    </main>
  );
}
