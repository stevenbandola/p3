import { Button, Drawer, Flex, Slider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
// import { updateUrlParams } from '@/utils/helpers'
// import type { RouterOutputs } from '@/utils/trpc'
// import { trpc } from '@/utils/trpc'
// import type { IRequirement2, Nullable } from '@/utils/types'
// import React from 'react'
// import { useEmployerIdParam } from '@/modules/employer/useEmployerIdParam'

interface IMenuContext {
  open: () => void
  close: () => void
  setMenuContent: (content: React.ReactNode) => void
}

export const MenuProvider = ({ children }: PropsWithChildren<{}>) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [menuContent, setMenuContent] = useState<React.ReactNode>(null)
  // const canvas = document.querySelector('canvas')
  //   useEffect(() => {
  //     canvas.
  //   },[opened]  )

  return (
    <MenuContext.Provider value={{ open, close, setMenuContent }}>
      {children}
      <Drawer position='bottom' opened={opened} onClose={close}>
        {menuContent}
      </Drawer>
    </MenuContext.Provider>
  )
}

export const MenuContext = createContext<IMenuContext | null>(null)

export function useMenuContext() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('PositionPage.* component must be rendered as child of PositionPage component')
  }
  return context
}

export default MenuContext
