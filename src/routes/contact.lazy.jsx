import { createLazyFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import postContact from '../api/postContact'

export const Route = createLazyFileRoute('/contact')({
  component: ContactRoute
})


function ContactRoute(){
  const mutation = useMutation({
    mutationFn: function(e){
      e.preventDefault();
      const formData = new FormData(e.target)
      return postContact(
        formData.get("name"),
       formData.get("email"),
        formData.get("message"),
         
      )
    }
  })

  return (
    <div className="contact">
      <h2>Contract</h2>
      {mutation.isSuccess ? (
        <h3>Submitted</h3>
      ): (
        <form onSubmit={mutation.mutate}>
          <input name='name' placeholder='name' />
          <input name='email' placeholder='email' type='email'/>
          <textarea name="message" placeholder='Message'></textarea>
          <button>Submit</button>
        </form>
      )}
    </div>
  )
}