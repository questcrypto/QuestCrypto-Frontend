import React from 'react'
import { Field } from 'formik'
import TextField from '@material-ui/core/TextField'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { colors } from 'shared/styles/theme'
import { TextWrappper } from '../styles'
import Icon from '../chatIcon/Icon'

const textFieldStyle = makeStyles(() =>
  createStyles({
    root: {
      marginBottom: '20px',
      lineHeight: '26px',
      color: '#1E3444',
      backgroundColor: colors.white,
    },
  })
)

interface Props {
  name: string
  label?: string
  type?: string
  maxDate?: any
}

const FormDatePicker = (props: Props) => {
  const { name, label, maxDate } = props
  const classes = textFieldStyle()
  return (
    <Field name={name}>
      {({ field, form, max }: any) => {
        const handleChange = (event: any) => {
          const fieldVal: any = event.target.value
          form.setFieldValue(field.name, fieldVal)
        }
        return (
          <TextWrappper>
            <TextField
              variant="outlined"
              fullWidth
              id={name}
              label={label}
              name={name}
              value={field.value}
              autoComplete={name}
              autoFocus
              onChange={handleChange}
              type="date"
              className={classes.root}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: !!maxDate && maxDate
              }}
            />
           
          </TextWrappper>
        )
      }}
    </Field>
  )
}
export default FormDatePicker

// moment(new Date()).format('YYYY-MM-DD')