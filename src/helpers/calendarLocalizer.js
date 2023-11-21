import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enES from 'date-fns/locale/es'
import { dateFnsLocalizer } from 'react-big-calendar'
const locales = {
    'es': enES,
  }
 export const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  })