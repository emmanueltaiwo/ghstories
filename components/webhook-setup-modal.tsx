'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WebhookSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const webhookURL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhooks/github`
    : '/api/webhooks/github';

export function WebhookSetupModal({ isOpen, onClose }: WebhookSetupModalProps) {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setStep(1);
        onClose();
      }
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookURL);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key='backdrop'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-9998'
          />

          <motion.div
            key='modal-content'
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className='fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-9999'
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='bg-white border-[3px] border-black rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-8 pointer-events-auto'
              style={{ transform: 'rotate(-0.5deg)' }}
            >
              <button
                onClick={handleClose}
                className='absolute top-4 right-4 p-2 hover:bg-black/5 rounded-lg transition-colors'
              >
                <X className='w-5 h-5' />
              </button>

              <div className='space-y-6'>
                <div>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='w-16 h-16 border-[3px] border-black rounded-xl flex items-center justify-center mx-auto mb-4 bg-white'
                    style={{ transform: 'rotate(-2deg)' }}
                  >
                    <span className='text-3xl'>🔗</span>
                  </motion.div>
                  <h2 className='text-3xl text-black text-center mb-2 font-(--font-sketch)'>
                    Connect Your Repository
                  </h2>
                  <p className='text-black/70 text-center font-(--font-sketch)'>
                    Set up a webhook to automatically create stories from your
                    commits
                  </p>
                </div>

                <div className='space-y-4'>
                  {[
                    {
                      step: 1,
                      title: 'Go to your repository settings',
                      desc: 'Navigate to your GitHub repository and click on Settings',
                      link: true,
                    },
                    {
                      step: 2,
                      title: 'Add a new webhook',
                      desc: 'In the left sidebar, click Webhooks, then Add webhook',
                    },
                    {
                      step: 3,
                      title: 'Configure the webhook',
                      fields: (
                        <div className='space-y-3 mt-2'>
                          <div>
                            <label className='text-sm mb-1 block font-(--font-sketch)'>
                              Payload URL
                            </label>

                            <div className='flex gap-2'>
                              <input
                                type='text'
                                readOnly
                                value={webhookURL}
                                className='flex-1 px-3 py-2 border-2 border-black rounded-lg bg-white text-sm font-mono'
                                onClick={() => setStep(4)}
                              />
                              <button
                                onClick={() => {
                                  copyToClipboard();
                                  setStep(4);
                                }}
                                className='px-4 py-2 border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors flex items-center gap-2'
                              >
                                {copied ? (
                                  <Check className='w-4 h-4' />
                                ) : (
                                  <Copy className='w-4 h-4' />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className='text-sm mb-1 block font-(--font-sketch)'>
                              Content type
                            </label>

                            <input
                              type='text'
                              readOnly
                              value='application/json'
                              className='w-full px-3 py-2 border-2 border-black rounded-lg bg-white text-sm font-mono'
                            />
                          </div>
                          <p className='text-sm text-black/70 font-(--font-sketch)'>
                            Select <strong>Just the push event</strong>
                          </p>
                        </div>
                      ),
                    },
                    {
                      step: 4,
                      title: 'Save and test',
                      desc: 'Click Add webhook. Then make a commit and push to test!',
                      tip: 'git commit --allow-empty -m "Test commit" && git push',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-4 border-2 rounded-lg transition-all ${step >= item.step ? 'border-black bg-white' : 'border-gray-300 bg-gray-50'}`}
                      style={{ borderRadius: '12px 16px 12px 16px' }}
                    >
                      <div className='flex items-start gap-3'>
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${step >= item.step ? 'bg-black text-white border-black' : 'bg-white border-gray-300 text-gray-400'}`}
                        >
                          <span className='font-bold text-sm'>{item.step}</span>
                        </div>
                        <div className='flex-1'>
                          <h3 className='text-lg mb-2 font-(--font-sketch)'>
                            {item.title}
                          </h3>
                          {'desc' in item && (
                            <p className='text-sm text-black/70 mb-3 font-(--font-sketch)'>
                              {item.desc}
                            </p>
                          )}
                          {'link' in item && item.link && (
                            <a
                              href='https://github.com'
                              target='_blank'
                              rel='noopener noreferrer'
                              className='inline-flex items-center gap-2 text-sm text-black hover:underline'
                              onClick={() => setStep(2)}
                            >
                              Open GitHub <ExternalLink className='w-4 h-4' />
                            </a>
                          )}
                          {'fields' in item && item.fields}
                          {'tip' in item && item.tip && (
                            <div className='mt-4 p-3 bg-black/5 rounded-lg border border-black/10'>
                              <p className='text-xs text-black/70 font-(--font-sketch)'>
                                <strong>Tip:</strong> After setting up, make a
                                test commit:
                              </p>
                              <code className='block mt-2 text-xs bg-white px-2 py-1 rounded border border-black/20 font-mono'>
                                {item.tip}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className='flex gap-3 pt-4 border-t-2 border-black/10'>
                  <button
                    onClick={handleClose}
                    className='flex-1 px-6 py-3 border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors font-(--font-sketch)'
                  >
                    Got it!
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined')
                        localStorage.setItem('webhook-setup-seen', 'true');
                      handleClose();
                    }}
                    className='px-6 py-3 border-2 border-black rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors font-(--font-sketch)'
                  >
                    Don&apos;t show again
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
