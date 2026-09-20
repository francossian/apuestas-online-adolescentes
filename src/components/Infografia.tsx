import { TOTAL_BLOQUES, bloqueId } from '../lib/bloques'
import { DESKTOP_QUERY, useMediaQuery, useWindowHeight, useWindowWidth } from '../lib/media'
import { vars } from '../lib/reveal'
import { Bloque1, Bloque2, Bloque3, Bloque4, Bloque5 } from './Bloques'
import { CountUp } from './CountUp'
import { DollarField } from './DollarField'
import { ProgressRail } from './ProgressRail'
import { Reveal } from './Reveal'

const LIENZO_W = 1600
const LIENZO_H = 860 // proporción ~1.86:1, parecida a la del área visible de un navegador
const MARGEN_V = 16 // aire arriba y abajo del lienzo (coincide con el padding de .app.desk)
const MARGEN_H = 24 // aire a los costados
/** Por debajo de esta escala el texto se vuelve ilegible: se prefiere scrollear un poco. */
const ESCALA_MIN = 0.7
/** En monitores grandes el lienzo puede agrandarse (es todo vectorial) para aprovechar el espacio. */
const ESCALA_MAX = 1.3
const URL_INFORME =
  'https://cruzroja.org.ar/observatorio-humanitario/wp-content/uploads/2025/12/INFORME-APUESTAS-ONLINE-Y-ADOLESCENCIA-pdf.pdf'
const URL_LINKEDIN = 'https://www.linkedin.com/in/fguiragossian/'
const IDS =Array.from({ length: TOTAL_BLOQUES }, (_, i) => bloqueId(i + 1))

function Cabecera() {
  return (
    <Reveal as="header" className="cabecera">
      <div>
        <h1 className="rv" style={vars({ '--i': 0 })}>
          Para los adolescentes, apostar es fácil.
          <br />
          Hablar del tema, no.
        </h1>
        <p className="bajada rv" style={vars({ '--i': 1 })}>
          Seis de cada diez adolescentes en Argentina apuestan online o tienen cerca a alguien que lo hace.
          La publicidad les llega a la gran mayoría, pero pocos conversan del tema en sus hogares.
        </p>
      </div>
      <div className="ficha rv" style={vars({ '--i': 2 })}>
        <div className="ficha-item">
          <b>
            <CountUp to={11421} extra={250} duration={2000} />
          </b>{' '}
          <span>adolescentes de 13 a 18 años</span>
        </div>
        <div className="ficha-item">
          <b>
            <CountUp to={231} extra={250} />
          </b>{' '}
          <span>escuelas secundarias</span>
        </div>
        <div className="ficha-item">
          <b>
            <CountUp to={16} extra={250} />
          </b>{' '}
          <span>provincias</span>
        </div>
        <div className="ficha-campo">Campo: agosto a octubre de 2025</div>
      </div>
    </Reveal>
  )
}

export function Infografia() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const width = useWindowWidth()
  const height = useWindowHeight()

  // desktop: el lienzo de 1920x1080 se escala para entrar entero en la ventana (ancho y alto),
  // sin pasar de ESCALA_MAX ni bajar de ESCALA_MIN
  const fitAncho = (width - MARGEN_H) / LIENZO_W
  const fitAlto = (height - MARGEN_V * 2) / LIENZO_H
  const scale = Math.min(ESCALA_MAX, fitAncho, Math.max(fitAlto, ESCALA_MIN))
  const escalaStyle = isDesktop ? { height: LIENZO_H * scale } : undefined
  const lienzoStyle = isDesktop ? { transform: `scale(${scale})` } : undefined

  // en desktop las cinco columnas aparecen en cascada; en mobile cada una espera a su scroll
  const stagger = (i: number) => (isDesktop ? 350 + i * 220 : 0)

  return (
    <div className={isDesktop ? 'app desk' : 'app mob'}>
      <DollarField />
      {!isDesktop && <ProgressRail ids={IDS} />}

      <div className="escala" style={escalaStyle}>
        <div className="lienzo" style={lienzoStyle}>
          <Cabecera />

          <div className="riel" aria-hidden="true">
            {IDS.map((id, i) => (
              <i key={id} className="nodo" style={{ left: `${(i / TOTAL_BLOQUES) * 100}%` }} />
            ))}
          </div>

          <main className="cuerpo">
            <Bloque1 delay={stagger(0)} />
            <Bloque2 delay={stagger(1)} />
            <Bloque3 delay={stagger(2)} />
            <Bloque4 delay={stagger(3)} />
            <Bloque5 delay={stagger(4)} />
          </main>

          <footer className="pie">
            <p>
              Fuente:{' '}
              <a href={URL_INFORME} target="_blank" rel="noopener noreferrer">
                &#8220;Apuestas Online y Adolescencia: construyendo entornos seguros&#8221;
              </a>
              . Argentina. Observatorio Humanitario de Cruz Roja Argentina, 2025.
            </p>
            <p className="pie-autor">
              Visualización:{' '}
              <a href={URL_LINKEDIN} target="_blank" rel="noopener noreferrer">
                <b>Franco Guiragossian</b>
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
