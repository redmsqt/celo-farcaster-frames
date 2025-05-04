// src/lib/hypercerts.ts
export type Hypercert = {
    id: string
    name: string
    image: string
    description: string
  }
  
  export async function getHypercerts(): Promise<Hypercert[]> {
    // Replace this with actual API/GraphQL call
    return [
      {
        id: '1',
        name: 'Clean Water Project',
        image: '/images/hypercert1.png',
        description: 'Providing clean water to rural areas.',
      },
      {
        id: '2',
        name: 'Reforestation Effort',
        image: '/images/hypercert2.png',
        description: 'Planting trees to reverse deforestation.',
      },
    ]
  }
  
  export async function getHypercertById(id: string): Promise<Hypercert | null> {
    const certs = await getHypercerts()
    return certs.find((cert) => cert.id === id) || null
  }
  