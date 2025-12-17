import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Fab,
  Drawer,
  Divider,
  Chip,
  useTheme,
  Zoom,
  Fade
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { aiAPI } from '../../services/api';

const AIChatbot = ({ isOpen, onClose, onToggle }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `**Hello!** I am **JAGRUK AI**, your disaster management education assistant.

You can ask me about:
- 🌍 Emergency procedures for earthquakes, fires, floods
- 🛡️ Safety tips and preparedness guidelines  
- 📋 Drill protocols and best practices
- 📚 NDMA guidelines for schools

*How can I help you today?*`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await aiAPI.chat(currentInput, messages);
      if (response.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.response
        }]);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '*I apologize, but I encountered an error. Please try again later.*'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'Earthquake safety',
    'Fire drill steps',
    'Flood emergency',
    'First aid basics'
  ];

  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <>
      <Zoom in={!isOpen} timeout={300}>
        <Fab
          onClick={onToggle}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1300,
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
              transform: 'scale(1.1) rotate(5deg)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
            }
          }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <SparkleIcon sx={{ fontSize: 28, color: 'white' }} />
          </motion.div>
        </Fab>
      </Zoom>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        sx={{ zIndex: 1400 }}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 440 },
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            bgcolor: theme.palette.background.paper,
            boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Box sx={{
              p: 2.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    width: 52,
                    height: 52,
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}>
                    <BotIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </motion.div>
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                    JAGRUK AI
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                    Disaster Management Assistant
                  </Typography>
                </Box>
                <IconButton 
                  onClick={onClose} 
                  sx={{ 
                    ml: 'auto', 
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.25)',
                      transform: 'rotate(90deg)'
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </motion.div>

          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2,
            bgcolor: isDark ? theme.palette.background.default : '#f8f9fa',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { 
              bgcolor: 'rgba(0,0,0,0.2)', 
              borderRadius: 3 
            }
          }}>
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.35, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
                  layout
                >
                  <Box sx={{
                    display: 'flex',
                    gap: 1.5,
                    mb: 2,
                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                  }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                    >
                      <Avatar sx={{
                        background: message.role === 'user' 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        width: 38,
                        height: 38,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}>
                        {message.role === 'user' ? <PersonIcon /> : <BotIcon />}
                      </Avatar>
                    </motion.div>
                    <Paper 
                      elevation={0}
                      sx={{
                        p: 2,
                        maxWidth: '85%',
                        background: message.role === 'user' 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : isDark ? theme.palette.background.paper : 'white',
                        color: message.role === 'user' 
                          ? 'white' 
                          : theme.palette.text.primary,
                        borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        '& p': { m: 0, mb: 1 },
                        '& p:last-child': { mb: 0 },
                        '& strong': { fontWeight: 600 },
                        '& em': { fontStyle: 'italic' },
                        '& ul, & ol': { pl: 2, m: 0, mb: 1 },
                        '& li': { mb: 0.5 },
                        '& code': {
                          bgcolor: message.role === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                          px: 0.5,
                          borderRadius: 1,
                          fontSize: '0.85em'
                        }
                      }}
                    >
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </Paper>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                    <Avatar sx={{ 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      width: 38, 
                      height: 38 
                    }}>
                      <BotIcon />
                    </Avatar>
                    <Paper elevation={0} sx={{ 
                      p: 2, 
                      borderRadius: '20px 20px 20px 4px',
                      bgcolor: isDark ? theme.palette.background.paper : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                    }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <CircularProgress size={18} sx={{ color: '#667eea' }} />
                      </motion.div>
                      <Typography variant="body2" color="text.secondary">
                        Thinking...
                      </Typography>
                    </Paper>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </Box>

          <Fade in={messages.length === 1}>
            <Box sx={{ 
              p: 2, 
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              display: messages.length === 1 ? 'block' : 'none'
            }}>
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 1.5, fontWeight: 600, letterSpacing: 0.5 }}>
                QUICK QUESTIONS
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {quickQuestions.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      label={q}
                      size="small"
                      onClick={() => setInput(q)}
                      sx={{ 
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                        color: isDark ? '#a5b4fc' : '#667eea',
                        fontWeight: 500,
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>
          </Fade>

          <Divider />
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Box sx={{ 
              p: 2, 
              bgcolor: theme.palette.background.paper,
              borderBottomLeftRadius: 24
            }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  placeholder="Ask about disaster safety..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={3}
                  size="small"
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.15)',
                        bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'white'
                      }
                    }
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton 
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    sx={{
                      width: 48,
                      height: 48,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        boxShadow: '0 6px 24px rgba(102, 126, 234, 0.5)',
                      },
                      '&:disabled': { 
                        background: theme.palette.action.disabledBackground,
                        color: theme.palette.action.disabled,
                        boxShadow: 'none'
                      }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Drawer>
    </>
  );
};

export default AIChatbot;
