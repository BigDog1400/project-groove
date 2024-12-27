// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createCanvas } from 'https://deno.land/x/canvas@v1.4.1/mod.ts'


interface ShareImageRequest {
  userId: string
  streak: number
  dailyCompletion: number
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting image generation...')
    
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    )
    console.log('Supabase client created with service role')

    // Get request body
    const { userId, streak, dailyCompletion }: ShareImageRequest = await req.json()
    console.log('Request body:', { userId, streak, dailyCompletion })

    // Create canvas
    console.log('Creating canvas...')
    const canvas = createCanvas(1200, 630)
    const ctx = canvas.getContext('2d')
    console.log('Canvas created')

    // Set background
    console.log('Drawing image...')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 1200, 630)

    // Add border
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 4
    ctx.strokeRect(4, 4, 1192, 622)

    // Add app name
    ctx.font = 'bold 60px system-ui'
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    ctx.fillText('Project Groove', 600, 100)

    // Add streak count
    ctx.font = 'bold 120px system-ui'
    ctx.fillStyle = '#FF4B4B'
    ctx.fillText(`${streak}`, 600, 300)
    
    ctx.font = 'bold 48px system-ui'
    ctx.fillStyle = '#000000'
    ctx.fillText('Day Streak! 🔥', 600, 380)

    // Add daily completion
    ctx.font = '36px system-ui'
    ctx.fillStyle = '#666666'
    ctx.fillText(`${Math.round(dailyCompletion)}% of daily goal completed`, 600, 500)
    console.log('Image drawn')

    // Convert canvas to buffer
    console.log('Converting to buffer...')
    const buffer = canvas.toBuffer()
    console.log('Buffer created')

    // Generate unique filename with user folder
    const filename = `${userId}/${Date.now()}.png`
    console.log('Uploading to storage:', filename)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('shareable-images')
      .upload(filename, buffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }
    console.log('Upload successful')

    // Get public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('shareable-images')
      .getPublicUrl(filename)
    console.log('Generated public URL:', publicUrl)

    return new Response(
      JSON.stringify({ url: publicUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: unknown) {
    console.error('Detailed error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-share-image' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
