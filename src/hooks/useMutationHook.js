import {useMutation} from "@tanstack/react-query"

export const useMutationHooks = ((fucCallBack) =>{
    const mutation = useMutation({
        mutationFn: fucCallBack
      })
    return mutation
})
