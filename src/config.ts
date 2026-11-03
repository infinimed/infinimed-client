export const config = {
  // Set NEXT_PUBLIC_BACKEND_URL (e.g. http://localhost:8080) to point the app
  // at a locally running infinimed-server.
  backendURL:
    process.env.NEXT_PUBLIC_BACKEND_URL || 'https://infinimed-launch-1.fly.dev',
  barikoiApiKey:
    // 'bkoi_beeba451768afcdf1d3980d61b16b745277153fb6b495c777f182d8d3be9a7f', //fake
    'bkoi_beeba451768afcdf1d3980d61b16b745277153fb6b495c777f182d8d3be9a7f2', //real
};
