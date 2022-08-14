import type { VercelRequest, VercelResponse } from  '@vercel/node';

export function (req: VercelRequest, res: VercelResponse) {
  res.send('Mydea Serverless API: ' + req.query.name);
};
