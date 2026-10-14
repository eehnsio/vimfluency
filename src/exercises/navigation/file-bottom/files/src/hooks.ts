// Goal: jump to the last line of the file.
// `G` goes to the last line and `gg` goes back to the first.

import { useState } from 'react'
import { useEffect } from 'react'
import { useMemo } from 'react'
import { useRef } from 'react'
import { useContext } from 'react'
import { useReducer } from 'react'
import { useCallback } from 'react'

export const hooks = 7
export default hooks