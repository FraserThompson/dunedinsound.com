import { FaMapMarkerAlt } from 'react-icons/fa'
import ReactDOMServer from 'react-dom/server'

let livingIcon = null
let deadIcon = null

if (typeof L !== 'undefined') {
  livingIcon = L.divIcon({
    className: 'alive-icon',
    html: ReactDOMServer.renderToString(<FaMapMarkerAlt />),
  })

  deadIcon = L.divIcon({
    className: 'dead-icon',
    html: '<span>✝</span>',
  })
}

export { livingIcon, deadIcon }
