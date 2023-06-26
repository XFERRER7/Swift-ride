import Button, { ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'


interface ILoadButtonProps extends ButtonProps {
  text: string
  isSending: boolean
}

export const LoadButton = ({text, isSending, ...props }: ILoadButtonProps) => {
  return (
    <>
      <Button
        disabled={isSending}
        startIcon={isSending ? <CircularProgress size={20} color="inherit" /> : null}
        {...props}
      >
        {text}
      </Button>
    </>
  )
}
