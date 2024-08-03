import { Button } from '@mantine/core'

export const DonationButton = () => {
  return (
    <Button
      onClick={() =>
        window
          .open(
            'https://www.paypal.com/donate/?business=3RCCAFD2GL58L&no_recurring=0&item_name=All+donations+go+towards+hosting+costs+and+development%21+Thank+you+for+your+contribution.+&currency_code=CAD',
            '_blank'
          )
          ?.focus()
      }
    >
      Donate
    </Button>
  )
}
