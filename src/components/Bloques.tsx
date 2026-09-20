import type { ReactNode } from 'react'
import { TOTAL_BLOQUES, bloqueId } from '../lib/bloques'
import { vars } from '../lib/reveal'
import { CountUp } from './CountUp'
import { Reveal } from './Reveal'

interface BloqueProps {
  n: number
  delay: number
  children: ReactNode
}

function Bloque({ n, delay, children }: BloqueProps) {
  return (
    <Reveal as="section" id={bloqueId(n)} className="bloque" delay={delay}>
      <span className="nro" aria-hidden="true">
        0{n} / 0{TOTAL_BLOQUES}
      </span>
      {children}
    </Reveal>
  )
}

/** Fila de barra: la barra y su número arrancan juntos, escalonados por fila. */
const filaDelay = (i: number) => 250 + i * 130

interface EntradaProps {
  pregunta: string
  cifra: number
  glosa: string
  lectura: string
}

function Entrada({ pregunta, cifra, glosa, lectura }: EntradaProps) {
  return (
    <div className="entrada">
      <h2 className="pregunta rv" style={vars({ '--i': 0 })}>
        {pregunta}
      </h2>
      <p className="cifra">
        <CountUp to={cifra} duration={1800} />
        <small>%</small>
      </p>
      <p className="glosa rv" style={vars({ '--i': 2 })}>
        {glosa}
      </p>
      <p className="lectura rv" style={vars({ '--i': 3 })}>
        {lectura}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------- 1
const PLAN = [
  { n: 16, tono: 'a', texto: 'Apuesta o apostó' },
  { n: 45, tono: 'b', texto: 'Conoce a alguien' },
  { n: 27, tono: 'c', texto: 'Ni apuesta ni conoce' },
  { n: 12, tono: 'd', texto: 'Nunca escuchó del tema' },
] as const

const PUNTOS = PLAN.flatMap(({ n, tono }) => Array.from({ length: n }, () => tono))

export function Bloque1({ delay }: { delay: number }) {
  return (
    <Bloque n={1} delay={delay}>
      <Entrada
        pregunta="¿A cuántos alcanza?"
        cifra={61}
        glosa="de los adolescentes está alcanzado por las apuestas online."
        lectura="El 45% nunca apostó, pero tiene cerca a alguien que sí. Se ve, se comenta, se normaliza."
      />

      <div className="visual">
        <div
          className="grilla"
          role="img"
          aria-label="Cada punto representa a 1 de cada 100 adolescentes: 16 apuestan o apostaron, 45 conocen a alguien que apuesta, 27 ni apuestan ni conocen y 12 nunca escucharon del tema."
        >
          {PUNTOS.map((tono, k) => (
            <i key={k} className={`pt c-${tono}`} style={vars({ '--k': k })} />
          ))}
        </div>

        <div className="leyenda rv" style={vars({ '--i': 6 })}>
          {PLAN.map(({ n, tono, texto }) => (
            <span key={tono}>
              <i className={`swatch c-${tono}`} />
              <span>{texto}</span>
              <b>
                <CountUp to={n} duration={1200} extra={500} />
              </b>
            </span>
          ))}
        </div>

        <div className="genero">
          <div className="gfila">
            <span className="getiqueta">Varones</span>
            <div className="gbarra" style={vars({ '--w': '100%', '--t': `${filaDelay(0) + 500}ms` })} />
            <b className="gvalor">
              <CountUp to={24} extra={filaDelay(0) + 500} />%
            </b>
          </div>
          <div className="gfila">
            <span className="getiqueta">Mujeres</span>
            <div className="gbarra" style={vars({ '--w': '33.3%', '--t': `${filaDelay(1) + 500}ms` })} />
            <b className="gvalor">
              <CountUp to={8} extra={filaDelay(1) + 500} />%
            </b>
          </div>
          <p className="remate rv" style={vars({ '--i': 8 })}>
            Los varones apuestan <b className="fuerte">3 veces más</b>.
          </p>
        </div>

        <p className="base">
          Base: 11.421 encuestados. La participación se cuadruplica entre los 13 y los 18 años: del 6% al 24%.
        </p>
      </div>
    </Bloque>
  )
}

// ---------------------------------------------------------------- 2
const EXPOSICION = [
  { etiqueta: 'Apuesta o apostó', valor: 78, clase: '' },
  { etiqueta: 'Conoce a alguien', valor: 79, clase: 'b2' },
  { etiqueta: 'Ni apuesta ni conoce', valor: 71, clase: 'b3' },
]

export function Bloque2({ delay }: { delay: number }) {
  return (
    <Bloque n={2} delay={delay}>
      <Entrada
        pregunta="¿Cómo aparece en sus vidas?"
        cifra={76}
        glosa="de los adolescentes vio publicidad de apuestas, haya apostado o no."
        lectura="Casi igual en los tres grupos: la publicidad no sigue al consumo, lo precede."
      />

      <div className="visual">
        <div className="barras">
          {EXPOSICION.map(({ etiqueta, valor, clase }, i) => (
            <div className="bfila" key={etiqueta}>
              <span className="betiqueta">{etiqueta}</span>
              <div className="btrack">
                <div className={`bfill ${clase}`} style={vars({ '--w': `${valor}%`, '--t': `${filaDelay(i)}ms` })} />
              </div>
              <b>
                <CountUp to={valor} extra={filaDelay(i)} />%
              </b>
            </div>
          ))}
        </div>

        <p className="remate rv" style={vars({ '--i': 6 })}>
          <span className="marca">53% de quienes apuestan cree que se gana plata fácil y rápido.</span>
        </p>
        <p className="remate rv" style={vars({ '--i': 7 })}>
          <span className="marca">44% de quienes apuestan recibió un bono promocional para empezar.</span>
        </p>

        <p className="base">
          Base: adolescentes que conocen el tema; 76% = promedio ponderado de los tres grupos. Influencers o famosos:
          66–76%.
        </p>
      </div>
    </Bloque>
  )
}

// ---------------------------------------------------------------- 3
export function Bloque3({ delay }: { delay: number }) {
  return (
    <Bloque n={3} delay={delay}>
      <Entrada
        pregunta="¿Qué tan difícil es entrar?"
        cifra={93}
        glosa="de quienes apuestan dice que acceder es fácil o muy fácil."
        lectura="Celular propio y billetera virtual: una práctica individual, fuera de la vista adulta."
      />

      <div className="visual">
        <div className="parstats">
          <div className="rv" style={vars({ '--i': 4 })}>
            <b>
              <CountUp to={83} extra={500} />%
            </b>
            apuesta desde
            <br />
            su celular propio
          </div>
          <div className="rv" style={vars({ '--i': 5 })}>
            <b>
              <CountUp to={83} extra={630} />%
            </b>
            paga con
            <br />
            billetera virtual
          </div>
        </div>

        <div className="dominios">
          <span className="chip rv" style={vars({ '--i': 6 })}>
            .bet.ar
          </span>
          <span className="interrog rv" style={vars({ '--i': 7 })}>
            ?
          </span>
          <span className="chip rv" style={vars({ '--i': 8 })}>
            .com
          </span>
        </div>
        <p className="remate rv" style={vars({ '--i': 9 })}>
          Entre 51% y 66% no distingue una plataforma habilitada de una ilegal.
        </p>
        <p className="remate rv" style={vars({ '--i': 10 })}>
          <span className="rojo">1 de cada 8</span> quedó debiendo dinero.
        </p>

        <p className="base">
          Base: adolescentes con experiencia directa. El 43% accedió con ayuda de un tercero; en el 57% de esos casos,
          amigos o compañeros.
        </p>
      </div>
    </Bloque>
  )
}

// ---------------------------------------------------------------- 4
function Globo() {
  return (
    <svg width="62" height="52" viewBox="0 0 62 52" aria-hidden="true">
      <path d="M2 2h58v34H22L9 48V36H2V2z" pathLength={1} fill="none" stroke="var(--gris)" strokeWidth="2" />
    </svg>
  )
}

export function Bloque4({ delay }: { delay: number }) {
  return (
    <Bloque n={4} delay={delay}>
      <Entrada
        pregunta="¿Dónde se habla del tema?"
        cifra={86}
        glosa="de los adolescentes habla poco o nada del tema en su casa."
        lectura="Un fenómeno que alcanza al 61% casi no se conversa donde podría detectarse a tiempo."
      />

      <div className="visual">
        <div className="globos">
          <div className="globo rv" style={vars({ '--i': 4 })}>
            <Globo />
            <div>
              <b>
                <CountUp to={84} extra={500} />–<CountUp to={87} extra={500} />%
              </b>
              habla poco o nunca
              <br />
              del tema en el hogar
            </div>
          </div>
          <div className="globo rv" style={vars({ '--i': 6 })}>
            <Globo />
            <div>
              <b>
                <CountUp to={78} extra={780} />–<CountUp to={79} extra={780} />%
              </b>
              habla poco o nunca
              <br />
              del tema en la escuela
            </div>
          </div>
        </div>

        <p className="remate rv" style={vars({ '--i': 8 })}>
          Reconocen el riesgo, pero no se preocupan: solo el <b className="fuerte">20%</b> de quienes apuestan dice
          preocuparse mucho o bastante, contra 36–39% de quienes no.
        </p>

        <p className="base">
          Base: quienes conocen el tema; 86% = promedio ponderado. El 78–89% reconoce que las apuestas generan
          adicción.
        </p>
      </div>
    </Bloque>
  )
}

// ---------------------------------------------------------------- 5
// primero lo que piden los adolescentes; después lo que recomienda el Observatorio
const PEDIDOS = [
  { texto: 'Talleres en la escuela: 4 de cada 10 los reclaman.' },
  { texto: 'Lo que más valoran: poder contarle a un adulto cercano sin sentirse juzgados.' },
  {
    tag: 'Recomienda el informe:',
    texto: 'verificar edad e identidad en las billeteras virtuales, donde hoy el control no se ejerce.',
  },
  {
    tag: 'Recomienda el informe:',
    texto: 'regular la publicidad y prohibir la promoción encubierta de influencers y famosos.',
  },
]

export function Bloque5({ delay }: { delay: number }) {
  return (
    <Bloque n={5} delay={delay}>
      <Entrada
        pregunta="¿Qué piden los adolescentes?"
        cifra={75}
        glosa="de los adolescentes pide controles más estrictos sobre las plataformas."
        lectura="La demanda es propia. Ocho de cada diez creen que las medidas actuales no funcionan."
      />

      <div className="visual">
        <div className="pedidos">
          {PEDIDOS.map(({ tag, texto }, i) => (
            <div className="pedido rv" key={texto} style={vars({ '--i': 4 + i * 1.4 })}>
              <i className="cuadro" />
              <span>
                {tag && <b className="fuerte">{tag} </b>}
                {texto}
              </span>
            </div>
          ))}
        </div>

        <p className="base">
          Base: adolescentes que conocen el tema. Piden conocer los riesgos, entender los mecanismos de captación y
          escuchar experiencias reales.
        </p>
      </div>
    </Bloque>
  )
}
