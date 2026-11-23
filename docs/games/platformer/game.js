var Fs=Object.defineProperty;var u=(t,r)=>Fs(t,"name",{value:r,configurable:!0});var Kt=(t,r)=>{for(var e in r)Fs(t,e,{get:r[e],enumerable:!0})};var U=1e-6,Z=typeof Float32Array<"u"?Float32Array:Array,Ce=Math.random,Ns="zyx";function Fe(t){return t>=0?Math.round(t):t%.5===0?Math.floor(t):Math.round(t)}u(Fe,"round");var Pp=Math.PI/180,Dp=180/Math.PI;var Zt={};Kt(Zt,{add:()=>wc,adjoint:()=>lc,clone:()=>tc,copy:()=>rc,create:()=>kn,determinant:()=>cc,equals:()=>Ec,exactEquals:()=>Sc,frob:()=>_c,fromMat2d:()=>vc,fromMat4:()=>ec,fromQuat:()=>gc,fromRotation:()=>pc,fromScaling:()=>fc,fromTranslation:()=>mc,fromValues:()=>ic,identity:()=>oc,invert:()=>ac,mul:()=>Ac,multiply:()=>Us,multiplyScalar:()=>Tc,multiplyScalarAndAdd:()=>Mc,normalFromMat4:()=>bc,projection:()=>xc,rotate:()=>dc,scale:()=>hc,set:()=>nc,str:()=>yc,sub:()=>Rc,subtract:()=>Os,translate:()=>uc,transpose:()=>sc});function kn(){var t=new Z(9);return Z!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t}u(kn,"create");function ec(t,r){return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[4],t[4]=r[5],t[5]=r[6],t[6]=r[8],t[7]=r[9],t[8]=r[10],t}u(ec,"fromMat4");function tc(t){var r=new Z(9);return r[0]=t[0],r[1]=t[1],r[2]=t[2],r[3]=t[3],r[4]=t[4],r[5]=t[5],r[6]=t[6],r[7]=t[7],r[8]=t[8],r}u(tc,"clone");function rc(t,r){return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t}u(rc,"copy");function ic(t,r,e,i,n,o,s,a,l){var c=new Z(9);return c[0]=t,c[1]=r,c[2]=e,c[3]=i,c[4]=n,c[5]=o,c[6]=s,c[7]=a,c[8]=l,c}u(ic,"fromValues");function nc(t,r,e,i,n,o,s,a,l,c){return t[0]=r,t[1]=e,t[2]=i,t[3]=n,t[4]=o,t[5]=s,t[6]=a,t[7]=l,t[8]=c,t}u(nc,"set");function oc(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}u(oc,"identity");function sc(t,r){if(t===r){var e=r[1],i=r[2],n=r[5];t[1]=r[3],t[2]=r[6],t[3]=e,t[5]=r[7],t[6]=i,t[7]=n}else t[0]=r[0],t[1]=r[3],t[2]=r[6],t[3]=r[1],t[4]=r[4],t[5]=r[7],t[6]=r[2],t[7]=r[5],t[8]=r[8];return t}u(sc,"transpose");function ac(t,r){var e=r[0],i=r[1],n=r[2],o=r[3],s=r[4],a=r[5],l=r[6],c=r[7],d=r[8],h=d*s-a*c,m=-d*o+a*l,p=c*o-s*l,v=e*h+i*m+n*p;return v?(v=1/v,t[0]=h*v,t[1]=(-d*i+n*c)*v,t[2]=(a*i-n*s)*v,t[3]=m*v,t[4]=(d*e-n*l)*v,t[5]=(-a*e+n*o)*v,t[6]=p*v,t[7]=(-c*e+i*l)*v,t[8]=(s*e-i*o)*v,t):null}u(ac,"invert");function lc(t,r){var e=r[0],i=r[1],n=r[2],o=r[3],s=r[4],a=r[5],l=r[6],c=r[7],d=r[8];return t[0]=s*d-a*c,t[1]=n*c-i*d,t[2]=i*a-n*s,t[3]=a*l-o*d,t[4]=e*d-n*l,t[5]=n*o-e*a,t[6]=o*c-s*l,t[7]=i*l-e*c,t[8]=e*s-i*o,t}u(lc,"adjoint");function cc(t){var r=t[0],e=t[1],i=t[2],n=t[3],o=t[4],s=t[5],a=t[6],l=t[7],c=t[8];return r*(c*o-s*l)+e*(-c*n+s*a)+i*(l*n-o*a)}u(cc,"determinant");function Us(t,r,e){var i=r[0],n=r[1],o=r[2],s=r[3],a=r[4],l=r[5],c=r[6],d=r[7],h=r[8],m=e[0],p=e[1],v=e[2],f=e[3],g=e[4],b=e[5],T=e[6],_=e[7],w=e[8];return t[0]=m*i+p*s+v*c,t[1]=m*n+p*a+v*d,t[2]=m*o+p*l+v*h,t[3]=f*i+g*s+b*c,t[4]=f*n+g*a+b*d,t[5]=f*o+g*l+b*h,t[6]=T*i+_*s+w*c,t[7]=T*n+_*a+w*d,t[8]=T*o+_*l+w*h,t}u(Us,"multiply");function uc(t,r,e){var i=r[0],n=r[1],o=r[2],s=r[3],a=r[4],l=r[5],c=r[6],d=r[7],h=r[8],m=e[0],p=e[1];return t[0]=i,t[1]=n,t[2]=o,t[3]=s,t[4]=a,t[5]=l,t[6]=m*i+p*s+c,t[7]=m*n+p*a+d,t[8]=m*o+p*l+h,t}u(uc,"translate");function dc(t,r,e){var i=r[0],n=r[1],o=r[2],s=r[3],a=r[4],l=r[5],c=r[6],d=r[7],h=r[8],m=Math.sin(e),p=Math.cos(e);return t[0]=p*i+m*s,t[1]=p*n+m*a,t[2]=p*o+m*l,t[3]=p*s-m*i,t[4]=p*a-m*n,t[5]=p*l-m*o,t[6]=c,t[7]=d,t[8]=h,t}u(dc,"rotate");function hc(t,r,e){var i=e[0],n=e[1];return t[0]=i*r[0],t[1]=i*r[1],t[2]=i*r[2],t[3]=n*r[3],t[4]=n*r[4],t[5]=n*r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t}u(hc,"scale");function mc(t,r){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=r[0],t[7]=r[1],t[8]=1,t}u(mc,"fromTranslation");function pc(t,r){var e=Math.sin(r),i=Math.cos(r);return t[0]=i,t[1]=e,t[2]=0,t[3]=-e,t[4]=i,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}u(pc,"fromRotation");function fc(t,r){return t[0]=r[0],t[1]=0,t[2]=0,t[3]=0,t[4]=r[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}u(fc,"fromScaling");function vc(t,r){return t[0]=r[0],t[1]=r[1],t[2]=0,t[3]=r[2],t[4]=r[3],t[5]=0,t[6]=r[4],t[7]=r[5],t[8]=1,t}u(vc,"fromMat2d");function gc(t,r){var e=r[0],i=r[1],n=r[2],o=r[3],s=e+e,a=i+i,l=n+n,c=e*s,d=i*s,h=i*a,m=n*s,p=n*a,v=n*l,f=o*s,g=o*a,b=o*l;return t[0]=1-h-v,t[3]=d-b,t[6]=m+g,t[1]=d+b,t[4]=1-c-v,t[7]=p-f,t[2]=m-g,t[5]=p+f,t[8]=1-c-h,t}u(gc,"fromQuat");function bc(t,r){var e=r[0],i=r[1],n=r[2],o=r[3],s=r[4],a=r[5],l=r[6],c=r[7],d=r[8],h=r[9],m=r[10],p=r[11],v=r[12],f=r[13],g=r[14],b=r[15],T=e*a-i*s,_=e*l-n*s,w=e*c-o*s,S=i*l-n*a,M=i*c-o*a,L=n*c-o*l,k=d*f-h*v,I=d*g-m*v,D=d*b-p*v,O=h*g-m*f,Y=h*b-p*f,J=m*b-p*g,N=T*J-_*Y+w*O+S*D-M*I+L*k;return N?(N=1/N,t[0]=(a*J-l*Y+c*O)*N,t[1]=(l*D-s*J-c*I)*N,t[2]=(s*Y-a*D+c*k)*N,t[3]=(n*Y-i*J-o*O)*N,t[4]=(e*J-n*D+o*I)*N,t[5]=(i*D-e*Y-o*k)*N,t[6]=(f*L-g*M+b*S)*N,t[7]=(g*w-v*L-b*_)*N,t[8]=(v*M-f*w+b*T)*N,t):null}u(bc,"normalFromMat4");function xc(t,r,e){return t[0]=2/r,t[1]=0,t[2]=0,t[3]=0,t[4]=-2/e,t[5]=0,t[6]=-1,t[7]=1,t[8]=1,t}u(xc,"projection");function yc(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"}u(yc,"str");function _c(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]+t[3]*t[3]+t[4]*t[4]+t[5]*t[5]+t[6]*t[6]+t[7]*t[7]+t[8]*t[8])}u(_c,"frob");function wc(t,r,e){return t[0]=r[0]+e[0],t[1]=r[1]+e[1],t[2]=r[2]+e[2],t[3]=r[3]+e[3],t[4]=r[4]+e[4],t[5]=r[5]+e[5],t[6]=r[6]+e[6],t[7]=r[7]+e[7],t[8]=r[8]+e[8],t}u(wc,"add");function Os(t,r,e){return t[0]=r[0]-e[0],t[1]=r[1]-e[1],t[2]=r[2]-e[2],t[3]=r[3]-e[3],t[4]=r[4]-e[4],t[5]=r[5]-e[5],t[6]=r[6]-e[6],t[7]=r[7]-e[7],t[8]=r[8]-e[8],t}u(Os,"subtract");function Tc(t,r,e){return t[0]=r[0]*e,t[1]=r[1]*e,t[2]=r[2]*e,t[3]=r[3]*e,t[4]=r[4]*e,t[5]=r[5]*e,t[6]=r[6]*e,t[7]=r[7]*e,t[8]=r[8]*e,t}u(Tc,"multiplyScalar");function Mc(t,r,e,i){return t[0]=r[0]+e[0]*i,t[1]=r[1]+e[1]*i,t[2]=r[2]+e[2]*i,t[3]=r[3]+e[3]*i,t[4]=r[4]+e[4]*i,t[5]=r[5]+e[5]*i,t[6]=r[6]+e[6]*i,t[7]=r[7]+e[7]*i,t[8]=r[8]+e[8]*i,t}u(Mc,"multiplyScalarAndAdd");function Sc(t,r){return t[0]===r[0]&&t[1]===r[1]&&t[2]===r[2]&&t[3]===r[3]&&t[4]===r[4]&&t[5]===r[5]&&t[6]===r[6]&&t[7]===r[7]&&t[8]===r[8]}u(Sc,"exactEquals");function Ec(t,r){var e=t[0],i=t[1],n=t[2],o=t[3],s=t[4],a=t[5],l=t[6],c=t[7],d=t[8],h=r[0],m=r[1],p=r[2],v=r[3],f=r[4],g=r[5],b=r[6],T=r[7],_=r[8];return Math.abs(e-h)<=U*Math.max(1,Math.abs(e),Math.abs(h))&&Math.abs(i-m)<=U*Math.max(1,Math.abs(i),Math.abs(m))&&Math.abs(n-p)<=U*Math.max(1,Math.abs(n),Math.abs(p))&&Math.abs(o-v)<=U*Math.max(1,Math.abs(o),Math.abs(v))&&Math.abs(s-f)<=U*Math.max(1,Math.abs(s),Math.abs(f))&&Math.abs(a-g)<=U*Math.max(1,Math.abs(a),Math.abs(g))&&Math.abs(l-b)<=U*Math.max(1,Math.abs(l),Math.abs(b))&&Math.abs(c-T)<=U*Math.max(1,Math.abs(c),Math.abs(T))&&Math.abs(d-_)<=U*Math.max(1,Math.abs(d),Math.abs(_))}u(Ec,"equals");var Ac=Us,Rc=Os;var E={};Kt(E,{add:()=>mu,adjoint:()=>kc,clone:()=>Lc,copy:()=>Xc,create:()=>Cc,decompose:()=>Zc,determinant:()=>Fc,equals:()=>gu,exactEquals:()=>vu,frob:()=>hu,fromQuat:()=>ru,fromQuat2:()=>jc,fromRotation:()=>Jc,fromRotationTranslation:()=>Vs,fromRotationTranslationScale:()=>eu,fromRotationTranslationScaleOrigin:()=>tu,fromScaling:()=>Hc,fromTranslation:()=>Wc,fromValues:()=>Pc,fromXRotation:()=>qc,fromYRotation:()=>Yc,fromZRotation:()=>$c,frustum:()=>iu,getRotation:()=>Qc,getScaling:()=>Ws,getTranslation:()=>Kc,identity:()=>zs,invert:()=>Ic,lookAt:()=>cu,mul:()=>bu,multiply:()=>Gs,multiplyScalar:()=>pu,multiplyScalarAndAdd:()=>fu,ortho:()=>au,orthoNO:()=>Js,orthoZO:()=>lu,perspective:()=>nu,perspectiveFromFieldOfView:()=>su,perspectiveNO:()=>Hs,perspectiveZO:()=>ou,rotate:()=>Oc,rotateX:()=>zc,rotateY:()=>Gc,rotateZ:()=>Vc,scale:()=>Uc,set:()=>Dc,str:()=>du,sub:()=>xu,subtract:()=>qs,targetTo:()=>uu,translate:()=>Nc,transpose:()=>Bc});function Cc(){var t=new Z(16);return Z!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}u(Cc,"create");function Lc(t){var r=new Z(16);return r[0]=t[0],r[1]=t[1],r[2]=t[2],r[3]=t[3],r[4]=t[4],r[5]=t[5],r[6]=t[6],r[7]=t[7],r[8]=t[8],r[9]=t[9],r[10]=t[10],r[11]=t[11],r[12]=t[12],r[13]=t[13],r[14]=t[14],r[15]=t[15],r}u(Lc,"clone");function Xc(t,r){return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],t}u(Xc,"copy");function Pc(t,r,e,i,n,o,s,a,l,c,d,h,m,p,v,f){var g=new Z(16);return g[0]=t,g[1]=r,g[2]=e,g[3]=i,g[4]=n,g[5]=o,g[6]=s,g[7]=a,g[8]=l,g[9]=c,g[10]=d,g[11]=h,g[12]=m,g[13]=p,g[14]=v,g[15]=f,g}u(Pc,"fromValues");function Dc(t,r,e,i,n,o,s,a,l,c,d,h,m,p,v,f,g){return t[0]=r,t[1]=e,t[2]=i,t[3]=n,t[4]=o,t[5]=s,t[6]=a,t[7]=l,t[8]=c,t[9]=d,t[10]=h,t[11]=m,t[12]=p,t[13]=v,t[14]=f,t[15]=g,t}u(Dc,"set");function zs(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}u(zs,"identity");function Bc(t,r){if(t===r){var e=r[1],i=r[2],n=r[3],o=r[6],s=r[7],a=r[11];t[1]=r[4],t[2]=r[8],t[3]=r[12],t[4]=e,t[6]=r[9],t[7]=r[13],t[8]=i,t[9]=o,t[11]=r[14],t[12]=n,t[13]=s,t[14]=a}else t[0]=r[0],t[1]=r[4],t[2]=r[8],t[3]=r[12],t[4]=r[1],t[5]=r[5],t[6]=r[9],t[7]=r[13],t[8]=r[2],t[9]=r[6],t[10]=r[10],t[11]=r[14],t[12]=r[3],t[13]=r[7],t[14]=r[11],t[15]=r[15];return t}u(Bc,"transpose");function Ic(t,r){var e=r[0],i=r[1],n=r[2],o=r[3],s=r[4],a=r[5],l=r[6],c=r[7],d=r[8],h=r[9],m=r[10],p=r[11],v=r[12],f=r[13],g=r[14],b=r[15],T=e*a-i*s,_=e*l-n*s,w=e*c-o*s,S=i*l-n*a,M=i*c-o*a,L=n*c-o*l,k=d*f-h*v,I=d*g-m*v,D=d*b-p*v,O=h*g-m*f,Y=h*b-p*f,J=m*b-p*g,N=T*J-_*Y+w*O+S*D-M*I+L*k;return N?(N=1/N,t[0]=(a*J-l*Y+c*O)*N,t[1]=(n*Y-i*J-o*O)*N,t[2]=(f*L-g*M+b*S)*N,t[3]=(m*M-h*L-p*S)*N,t[4]=(l*D-s*J-c*I)*N,t[5]=(e*J-n*D+o*I)*N,t[6]=(g*w-v*L-b*_)*N,t[7]=(d*L-m*w+p*_)*N,t[8]=(s*Y-a*D+c*k)*N,t[9]=(i*D-e*Y-o*k)*N,t[10]=(v*M-f*w+b*T)*N,t[11]=(h*w-d*M-p*T)*N,t[12]=(a*I-s*O-l*k)*N,t[13]=(e*O-i*I+n*k)*N,t[14]=(f*_-v*S-g*T)*N,t[15]=(d*S-h*_+m*T)*N,t):null}u(Ic,"invert");function kc(t,r){var e=r[0],i=r[1],n=r[2],o=r[3],s=r[4],a=r[5],l=r[6],c=r[7],d=r[8],h=r[9],m=r[10],p=r[11],v=r[12],f=r[13],g=r[14],b=r[15],T=e*a-i*s,_=e*l-n*s,w=e*c-o*s,S=i*l-n*a,M=i*c-o*a,L=n*c-o*l,k=d*f-h*v,I=d*g-m*v,D=d*b-p*v,O=h*g-m*f,Y=h*b-p*f,J=m*b-p*g;return t[0]=a*J-l*Y+c*O,t[1]=n*Y-i*J-o*O,t[2]=f*L-g*M+b*S,t[3]=m*M-h*L-p*S,t[4]=l*D-s*J-c*I,t[5]=e*J-n*D+o*I,t[6]=g*w-v*L-b*_,t[7]=d*L-m*w+p*_,t[8]=s*Y-a*D+c*k,t[9]=i*D-e*Y-o*k,t[10]=v*M-f*w+b*T,t[11]=h*w-d*M-p*T,t[12]=a*I-s*O-l*k,t[13]=e*O-i*I+n*k,t[14]=f*_-v*S-g*T,t[15]=d*S-h*_+m*T,t}u(kc,"adjoint");function Fc(t){var r=t[0],e=t[1],i=t[2],n=t[3],o=t[4],s=t[5],a=t[6],l=t[7],c=t[8],d=t[9],h=t[10],m=t[11],p=t[12],v=t[13],f=t[14],g=t[15],b=r*s-e*o,T=r*a-i*o,_=e*a-i*s,w=c*v-d*p,S=c*f-h*p,M=d*f-h*v,L=r*M-e*S+i*w,k=o*M-s*S+a*w,I=c*_-d*T+h*b,D=p*_-v*T+f*b;return l*L-n*k+g*I-m*D}u(Fc,"determinant");function Gs(t,r,e){var i=r[0],n=r[1],o=r[2],s=r[3],a=r[4],l=r[5],c=r[6],d=r[7],h=r[8],m=r[9],p=r[10],v=r[11],f=r[12],g=r[13],b=r[14],T=r[15],_=e[0],w=e[1],S=e[2],M=e[3];return t[0]=_*i+w*a+S*h+M*f,t[1]=_*n+w*l+S*m+M*g,t[2]=_*o+w*c+S*p+M*b,t[3]=_*s+w*d+S*v+M*T,_=e[4],w=e[5],S=e[6],M=e[7],t[4]=_*i+w*a+S*h+M*f,t[5]=_*n+w*l+S*m+M*g,t[6]=_*o+w*c+S*p+M*b,t[7]=_*s+w*d+S*v+M*T,_=e[8],w=e[9],S=e[10],M=e[11],t[8]=_*i+w*a+S*h+M*f,t[9]=_*n+w*l+S*m+M*g,t[10]=_*o+w*c+S*p+M*b,t[11]=_*s+w*d+S*v+M*T,_=e[12],w=e[13],S=e[14],M=e[15],t[12]=_*i+w*a+S*h+M*f,t[13]=_*n+w*l+S*m+M*g,t[14]=_*o+w*c+S*p+M*b,t[15]=_*s+w*d+S*v+M*T,t}u(Gs,"multiply");function Nc(t,r,e){var i=e[0],n=e[1],o=e[2],s,a,l,c,d,h,m,p,v,f,g,b;return r===t?(t[12]=r[0]*i+r[4]*n+r[8]*o+r[12],t[13]=r[1]*i+r[5]*n+r[9]*o+r[13],t[14]=r[2]*i+r[6]*n+r[10]*o+r[14],t[15]=r[3]*i+r[7]*n+r[11]*o+r[15]):(s=r[0],a=r[1],l=r[2],c=r[3],d=r[4],h=r[5],m=r[6],p=r[7],v=r[8],f=r[9],g=r[10],b=r[11],t[0]=s,t[1]=a,t[2]=l,t[3]=c,t[4]=d,t[5]=h,t[6]=m,t[7]=p,t[8]=v,t[9]=f,t[10]=g,t[11]=b,t[12]=s*i+d*n+v*o+r[12],t[13]=a*i+h*n+f*o+r[13],t[14]=l*i+m*n+g*o+r[14],t[15]=c*i+p*n+b*o+r[15]),t}u(Nc,"translate");function Uc(t,r,e){var i=e[0],n=e[1],o=e[2];return t[0]=r[0]*i,t[1]=r[1]*i,t[2]=r[2]*i,t[3]=r[3]*i,t[4]=r[4]*n,t[5]=r[5]*n,t[6]=r[6]*n,t[7]=r[7]*n,t[8]=r[8]*o,t[9]=r[9]*o,t[10]=r[10]*o,t[11]=r[11]*o,t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],t}u(Uc,"scale");function Oc(t,r,e,i){var n=i[0],o=i[1],s=i[2],a=Math.sqrt(n*n+o*o+s*s),l,c,d,h,m,p,v,f,g,b,T,_,w,S,M,L,k,I,D,O,Y,J,N,we;return a<U?null:(a=1/a,n*=a,o*=a,s*=a,l=Math.sin(e),c=Math.cos(e),d=1-c,h=r[0],m=r[1],p=r[2],v=r[3],f=r[4],g=r[5],b=r[6],T=r[7],_=r[8],w=r[9],S=r[10],M=r[11],L=n*n*d+c,k=o*n*d+s*l,I=s*n*d-o*l,D=n*o*d-s*l,O=o*o*d+c,Y=s*o*d+n*l,J=n*s*d+o*l,N=o*s*d-n*l,we=s*s*d+c,t[0]=h*L+f*k+_*I,t[1]=m*L+g*k+w*I,t[2]=p*L+b*k+S*I,t[3]=v*L+T*k+M*I,t[4]=h*D+f*O+_*Y,t[5]=m*D+g*O+w*Y,t[6]=p*D+b*O+S*Y,t[7]=v*D+T*O+M*Y,t[8]=h*J+f*N+_*we,t[9]=m*J+g*N+w*we,t[10]=p*J+b*N+S*we,t[11]=v*J+T*N+M*we,r!==t&&(t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15]),t)}u(Oc,"rotate");function zc(t,r,e){var i=Math.sin(e),n=Math.cos(e),o=r[4],s=r[5],a=r[6],l=r[7],c=r[8],d=r[9],h=r[10],m=r[11];return r!==t&&(t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15]),t[4]=o*n+c*i,t[5]=s*n+d*i,t[6]=a*n+h*i,t[7]=l*n+m*i,t[8]=c*n-o*i,t[9]=d*n-s*i,t[10]=h*n-a*i,t[11]=m*n-l*i,t}u(zc,"rotateX");function Gc(t,r,e){var i=Math.sin(e),n=Math.cos(e),o=r[0],s=r[1],a=r[2],l=r[3],c=r[8],d=r[9],h=r[10],m=r[11];return r!==t&&(t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15]),t[0]=o*n-c*i,t[1]=s*n-d*i,t[2]=a*n-h*i,t[3]=l*n-m*i,t[8]=o*i+c*n,t[9]=s*i+d*n,t[10]=a*i+h*n,t[11]=l*i+m*n,t}u(Gc,"rotateY");function Vc(t,r,e){var i=Math.sin(e),n=Math.cos(e),o=r[0],s=r[1],a=r[2],l=r[3],c=r[4],d=r[5],h=r[6],m=r[7];return r!==t&&(t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15]),t[0]=o*n+c*i,t[1]=s*n+d*i,t[2]=a*n+h*i,t[3]=l*n+m*i,t[4]=c*n-o*i,t[5]=d*n-s*i,t[6]=h*n-a*i,t[7]=m*n-l*i,t}u(Vc,"rotateZ");function Wc(t,r){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t}u(Wc,"fromTranslation");function Hc(t,r){return t[0]=r[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=r[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=r[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}u(Hc,"fromScaling");function Jc(t,r,e){var i=e[0],n=e[1],o=e[2],s=Math.sqrt(i*i+n*n+o*o),a,l,c;return s<U?null:(s=1/s,i*=s,n*=s,o*=s,a=Math.sin(r),l=Math.cos(r),c=1-l,t[0]=i*i*c+l,t[1]=n*i*c+o*a,t[2]=o*i*c-n*a,t[3]=0,t[4]=i*n*c-o*a,t[5]=n*n*c+l,t[6]=o*n*c+i*a,t[7]=0,t[8]=i*o*c+n*a,t[9]=n*o*c-i*a,t[10]=o*o*c+l,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)}u(Jc,"fromRotation");function qc(t,r){var e=Math.sin(r),i=Math.cos(r);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=i,t[6]=e,t[7]=0,t[8]=0,t[9]=-e,t[10]=i,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}u(qc,"fromXRotation");function Yc(t,r){var e=Math.sin(r),i=Math.cos(r);return t[0]=i,t[1]=0,t[2]=-e,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=e,t[9]=0,t[10]=i,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}u(Yc,"fromYRotation");function $c(t,r){var e=Math.sin(r),i=Math.cos(r);return t[0]=i,t[1]=e,t[2]=0,t[3]=0,t[4]=-e,t[5]=i,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}u($c,"fromZRotation");function Vs(t,r,e){var i=r[0],n=r[1],o=r[2],s=r[3],a=i+i,l=n+n,c=o+o,d=i*a,h=i*l,m=i*c,p=n*l,v=n*c,f=o*c,g=s*a,b=s*l,T=s*c;return t[0]=1-(p+f),t[1]=h+T,t[2]=m-b,t[3]=0,t[4]=h-T,t[5]=1-(d+f),t[6]=v+g,t[7]=0,t[8]=m+b,t[9]=v-g,t[10]=1-(d+p),t[11]=0,t[12]=e[0],t[13]=e[1],t[14]=e[2],t[15]=1,t}u(Vs,"fromRotationTranslation");function jc(t,r){var e=new Z(3),i=-r[0],n=-r[1],o=-r[2],s=r[3],a=r[4],l=r[5],c=r[6],d=r[7],h=i*i+n*n+o*o+s*s;return h>0?(e[0]=(a*s+d*i+l*o-c*n)*2/h,e[1]=(l*s+d*n+c*i-a*o)*2/h,e[2]=(c*s+d*o+a*n-l*i)*2/h):(e[0]=(a*s+d*i+l*o-c*n)*2,e[1]=(l*s+d*n+c*i-a*o)*2,e[2]=(c*s+d*o+a*n-l*i)*2),Vs(t,r,e),t}u(jc,"fromQuat2");function Kc(t,r){return t[0]=r[12],t[1]=r[13],t[2]=r[14],t}u(Kc,"getTranslation");function Ws(t,r){var e=r[0],i=r[1],n=r[2],o=r[4],s=r[5],a=r[6],l=r[8],c=r[9],d=r[10];return t[0]=Math.sqrt(e*e+i*i+n*n),t[1]=Math.sqrt(o*o+s*s+a*a),t[2]=Math.sqrt(l*l+c*c+d*d),t}u(Ws,"getScaling");function Qc(t,r){var e=new Z(3);Ws(e,r);var i=1/e[0],n=1/e[1],o=1/e[2],s=r[0]*i,a=r[1]*n,l=r[2]*o,c=r[4]*i,d=r[5]*n,h=r[6]*o,m=r[8]*i,p=r[9]*n,v=r[10]*o,f=s+d+v,g=0;return f>0?(g=Math.sqrt(f+1)*2,t[3]=.25*g,t[0]=(h-p)/g,t[1]=(m-l)/g,t[2]=(a-c)/g):s>d&&s>v?(g=Math.sqrt(1+s-d-v)*2,t[3]=(h-p)/g,t[0]=.25*g,t[1]=(a+c)/g,t[2]=(m+l)/g):d>v?(g=Math.sqrt(1+d-s-v)*2,t[3]=(m-l)/g,t[0]=(a+c)/g,t[1]=.25*g,t[2]=(h+p)/g):(g=Math.sqrt(1+v-s-d)*2,t[3]=(a-c)/g,t[0]=(m+l)/g,t[1]=(h+p)/g,t[2]=.25*g),t}u(Qc,"getRotation");function Zc(t,r,e,i){r[0]=i[12],r[1]=i[13],r[2]=i[14];var n=i[0],o=i[1],s=i[2],a=i[4],l=i[5],c=i[6],d=i[8],h=i[9],m=i[10];e[0]=Math.sqrt(n*n+o*o+s*s),e[1]=Math.sqrt(a*a+l*l+c*c),e[2]=Math.sqrt(d*d+h*h+m*m);var p=1/e[0],v=1/e[1],f=1/e[2],g=n*p,b=o*v,T=s*f,_=a*p,w=l*v,S=c*f,M=d*p,L=h*v,k=m*f,I=g+w+k,D=0;return I>0?(D=Math.sqrt(I+1)*2,t[3]=.25*D,t[0]=(S-L)/D,t[1]=(M-T)/D,t[2]=(b-_)/D):g>w&&g>k?(D=Math.sqrt(1+g-w-k)*2,t[3]=(S-L)/D,t[0]=.25*D,t[1]=(b+_)/D,t[2]=(M+T)/D):w>k?(D=Math.sqrt(1+w-g-k)*2,t[3]=(M-T)/D,t[0]=(b+_)/D,t[1]=.25*D,t[2]=(S+L)/D):(D=Math.sqrt(1+k-g-w)*2,t[3]=(b-_)/D,t[0]=(M+T)/D,t[1]=(S+L)/D,t[2]=.25*D),t}u(Zc,"decompose");function eu(t,r,e,i){var n=r[0],o=r[1],s=r[2],a=r[3],l=n+n,c=o+o,d=s+s,h=n*l,m=n*c,p=n*d,v=o*c,f=o*d,g=s*d,b=a*l,T=a*c,_=a*d,w=i[0],S=i[1],M=i[2];return t[0]=(1-(v+g))*w,t[1]=(m+_)*w,t[2]=(p-T)*w,t[3]=0,t[4]=(m-_)*S,t[5]=(1-(h+g))*S,t[6]=(f+b)*S,t[7]=0,t[8]=(p+T)*M,t[9]=(f-b)*M,t[10]=(1-(h+v))*M,t[11]=0,t[12]=e[0],t[13]=e[1],t[14]=e[2],t[15]=1,t}u(eu,"fromRotationTranslationScale");function tu(t,r,e,i,n){var o=r[0],s=r[1],a=r[2],l=r[3],c=o+o,d=s+s,h=a+a,m=o*c,p=o*d,v=o*h,f=s*d,g=s*h,b=a*h,T=l*c,_=l*d,w=l*h,S=i[0],M=i[1],L=i[2],k=n[0],I=n[1],D=n[2],O=(1-(f+b))*S,Y=(p+w)*S,J=(v-_)*S,N=(p-w)*M,we=(1-(m+b))*M,Ct=(g+T)*M,pt=(v+_)*L,Er=(g-T)*L,si=(1-(m+f))*L;return t[0]=O,t[1]=Y,t[2]=J,t[3]=0,t[4]=N,t[5]=we,t[6]=Ct,t[7]=0,t[8]=pt,t[9]=Er,t[10]=si,t[11]=0,t[12]=e[0]+k-(O*k+N*I+pt*D),t[13]=e[1]+I-(Y*k+we*I+Er*D),t[14]=e[2]+D-(J*k+Ct*I+si*D),t[15]=1,t}u(tu,"fromRotationTranslationScaleOrigin");function ru(t,r){var e=r[0],i=r[1],n=r[2],o=r[3],s=e+e,a=i+i,l=n+n,c=e*s,d=i*s,h=i*a,m=n*s,p=n*a,v=n*l,f=o*s,g=o*a,b=o*l;return t[0]=1-h-v,t[1]=d+b,t[2]=m-g,t[3]=0,t[4]=d-b,t[5]=1-c-v,t[6]=p+f,t[7]=0,t[8]=m+g,t[9]=p-f,t[10]=1-c-h,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}u(ru,"fromQuat");function iu(t,r,e,i,n,o,s){var a=1/(e-r),l=1/(n-i),c=1/(o-s);return t[0]=o*2*a,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=o*2*l,t[6]=0,t[7]=0,t[8]=(e+r)*a,t[9]=(n+i)*l,t[10]=(s+o)*c,t[11]=-1,t[12]=0,t[13]=0,t[14]=s*o*2*c,t[15]=0,t}u(iu,"frustum");function Hs(t,r,e,i,n){var o=1/Math.tan(r/2);if(t[0]=o/e,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=o,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,n!=null&&n!==1/0){var s=1/(i-n);t[10]=(n+i)*s,t[14]=2*n*i*s}else t[10]=-1,t[14]=-2*i;return t}u(Hs,"perspectiveNO");var nu=Hs;function ou(t,r,e,i,n){var o=1/Math.tan(r/2);if(t[0]=o/e,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=o,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,n!=null&&n!==1/0){var s=1/(i-n);t[10]=n*s,t[14]=n*i*s}else t[10]=-1,t[14]=-i;return t}u(ou,"perspectiveZO");function su(t,r,e,i){var n=Math.tan(r.upDegrees*Math.PI/180),o=Math.tan(r.downDegrees*Math.PI/180),s=Math.tan(r.leftDegrees*Math.PI/180),a=Math.tan(r.rightDegrees*Math.PI/180),l=2/(s+a),c=2/(n+o);return t[0]=l,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=c,t[6]=0,t[7]=0,t[8]=-((s-a)*l*.5),t[9]=(n-o)*c*.5,t[10]=i/(e-i),t[11]=-1,t[12]=0,t[13]=0,t[14]=i*e/(e-i),t[15]=0,t}u(su,"perspectiveFromFieldOfView");function Js(t,r,e,i,n,o,s){var a=1/(r-e),l=1/(i-n),c=1/(o-s);return t[0]=-2*a,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*l,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*c,t[11]=0,t[12]=(r+e)*a,t[13]=(n+i)*l,t[14]=(s+o)*c,t[15]=1,t}u(Js,"orthoNO");var au=Js;function lu(t,r,e,i,n,o,s){var a=1/(r-e),l=1/(i-n),c=1/(o-s);return t[0]=-2*a,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*l,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=c,t[11]=0,t[12]=(r+e)*a,t[13]=(n+i)*l,t[14]=o*c,t[15]=1,t}u(lu,"orthoZO");function cu(t,r,e,i){var n,o,s,a,l,c,d,h,m,p,v=r[0],f=r[1],g=r[2],b=i[0],T=i[1],_=i[2],w=e[0],S=e[1],M=e[2];return Math.abs(v-w)<U&&Math.abs(f-S)<U&&Math.abs(g-M)<U?zs(t):(d=v-w,h=f-S,m=g-M,p=1/Math.sqrt(d*d+h*h+m*m),d*=p,h*=p,m*=p,n=T*m-_*h,o=_*d-b*m,s=b*h-T*d,p=Math.sqrt(n*n+o*o+s*s),p?(p=1/p,n*=p,o*=p,s*=p):(n=0,o=0,s=0),a=h*s-m*o,l=m*n-d*s,c=d*o-h*n,p=Math.sqrt(a*a+l*l+c*c),p?(p=1/p,a*=p,l*=p,c*=p):(a=0,l=0,c=0),t[0]=n,t[1]=a,t[2]=d,t[3]=0,t[4]=o,t[5]=l,t[6]=h,t[7]=0,t[8]=s,t[9]=c,t[10]=m,t[11]=0,t[12]=-(n*v+o*f+s*g),t[13]=-(a*v+l*f+c*g),t[14]=-(d*v+h*f+m*g),t[15]=1,t)}u(cu,"lookAt");function uu(t,r,e,i){var n=r[0],o=r[1],s=r[2],a=i[0],l=i[1],c=i[2],d=n-e[0],h=o-e[1],m=s-e[2],p=d*d+h*h+m*m;p>0&&(p=1/Math.sqrt(p),d*=p,h*=p,m*=p);var v=l*m-c*h,f=c*d-a*m,g=a*h-l*d;return p=v*v+f*f+g*g,p>0&&(p=1/Math.sqrt(p),v*=p,f*=p,g*=p),t[0]=v,t[1]=f,t[2]=g,t[3]=0,t[4]=h*g-m*f,t[5]=m*v-d*g,t[6]=d*f-h*v,t[7]=0,t[8]=d,t[9]=h,t[10]=m,t[11]=0,t[12]=n,t[13]=o,t[14]=s,t[15]=1,t}u(uu,"targetTo");function du(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"}u(du,"str");function hu(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]+t[3]*t[3]+t[4]*t[4]+t[5]*t[5]+t[6]*t[6]+t[7]*t[7]+t[8]*t[8]+t[9]*t[9]+t[10]*t[10]+t[11]*t[11]+t[12]*t[12]+t[13]*t[13]+t[14]*t[14]+t[15]*t[15])}u(hu,"frob");function mu(t,r,e){return t[0]=r[0]+e[0],t[1]=r[1]+e[1],t[2]=r[2]+e[2],t[3]=r[3]+e[3],t[4]=r[4]+e[4],t[5]=r[5]+e[5],t[6]=r[6]+e[6],t[7]=r[7]+e[7],t[8]=r[8]+e[8],t[9]=r[9]+e[9],t[10]=r[10]+e[10],t[11]=r[11]+e[11],t[12]=r[12]+e[12],t[13]=r[13]+e[13],t[14]=r[14]+e[14],t[15]=r[15]+e[15],t}u(mu,"add");function qs(t,r,e){return t[0]=r[0]-e[0],t[1]=r[1]-e[1],t[2]=r[2]-e[2],t[3]=r[3]-e[3],t[4]=r[4]-e[4],t[5]=r[5]-e[5],t[6]=r[6]-e[6],t[7]=r[7]-e[7],t[8]=r[8]-e[8],t[9]=r[9]-e[9],t[10]=r[10]-e[10],t[11]=r[11]-e[11],t[12]=r[12]-e[12],t[13]=r[13]-e[13],t[14]=r[14]-e[14],t[15]=r[15]-e[15],t}u(qs,"subtract");function pu(t,r,e){return t[0]=r[0]*e,t[1]=r[1]*e,t[2]=r[2]*e,t[3]=r[3]*e,t[4]=r[4]*e,t[5]=r[5]*e,t[6]=r[6]*e,t[7]=r[7]*e,t[8]=r[8]*e,t[9]=r[9]*e,t[10]=r[10]*e,t[11]=r[11]*e,t[12]=r[12]*e,t[13]=r[13]*e,t[14]=r[14]*e,t[15]=r[15]*e,t}u(pu,"multiplyScalar");function fu(t,r,e,i){return t[0]=r[0]+e[0]*i,t[1]=r[1]+e[1]*i,t[2]=r[2]+e[2]*i,t[3]=r[3]+e[3]*i,t[4]=r[4]+e[4]*i,t[5]=r[5]+e[5]*i,t[6]=r[6]+e[6]*i,t[7]=r[7]+e[7]*i,t[8]=r[8]+e[8]*i,t[9]=r[9]+e[9]*i,t[10]=r[10]+e[10]*i,t[11]=r[11]+e[11]*i,t[12]=r[12]+e[12]*i,t[13]=r[13]+e[13]*i,t[14]=r[14]+e[14]*i,t[15]=r[15]+e[15]*i,t}u(fu,"multiplyScalarAndAdd");function vu(t,r){return t[0]===r[0]&&t[1]===r[1]&&t[2]===r[2]&&t[3]===r[3]&&t[4]===r[4]&&t[5]===r[5]&&t[6]===r[6]&&t[7]===r[7]&&t[8]===r[8]&&t[9]===r[9]&&t[10]===r[10]&&t[11]===r[11]&&t[12]===r[12]&&t[13]===r[13]&&t[14]===r[14]&&t[15]===r[15]}u(vu,"exactEquals");function gu(t,r){var e=t[0],i=t[1],n=t[2],o=t[3],s=t[4],a=t[5],l=t[6],c=t[7],d=t[8],h=t[9],m=t[10],p=t[11],v=t[12],f=t[13],g=t[14],b=t[15],T=r[0],_=r[1],w=r[2],S=r[3],M=r[4],L=r[5],k=r[6],I=r[7],D=r[8],O=r[9],Y=r[10],J=r[11],N=r[12],we=r[13],Ct=r[14],pt=r[15];return Math.abs(e-T)<=U*Math.max(1,Math.abs(e),Math.abs(T))&&Math.abs(i-_)<=U*Math.max(1,Math.abs(i),Math.abs(_))&&Math.abs(n-w)<=U*Math.max(1,Math.abs(n),Math.abs(w))&&Math.abs(o-S)<=U*Math.max(1,Math.abs(o),Math.abs(S))&&Math.abs(s-M)<=U*Math.max(1,Math.abs(s),Math.abs(M))&&Math.abs(a-L)<=U*Math.max(1,Math.abs(a),Math.abs(L))&&Math.abs(l-k)<=U*Math.max(1,Math.abs(l),Math.abs(k))&&Math.abs(c-I)<=U*Math.max(1,Math.abs(c),Math.abs(I))&&Math.abs(d-D)<=U*Math.max(1,Math.abs(d),Math.abs(D))&&Math.abs(h-O)<=U*Math.max(1,Math.abs(h),Math.abs(O))&&Math.abs(m-Y)<=U*Math.max(1,Math.abs(m),Math.abs(Y))&&Math.abs(p-J)<=U*Math.max(1,Math.abs(p),Math.abs(J))&&Math.abs(v-N)<=U*Math.max(1,Math.abs(v),Math.abs(N))&&Math.abs(f-we)<=U*Math.max(1,Math.abs(f),Math.abs(we))&&Math.abs(g-Ct)<=U*Math.max(1,Math.abs(g),Math.abs(Ct))&&Math.abs(b-pt)<=U*Math.max(1,Math.abs(b),Math.abs(pt))}u(gu,"equals");var bu=Gs,xu=qs;var X={};Kt(X,{add:()=>Gd,calculateW:()=>Xd,clone:()=>Nd,conjugate:()=>Id,copy:()=>Od,create:()=>Yn,dot:()=>ma,equals:()=>Yd,exactEquals:()=>qd,exp:()=>ca,fromEuler:()=>kd,fromMat3:()=>da,fromValues:()=>Ud,getAngle:()=>Ad,getAxisAngle:()=>Ed,identity:()=>Sd,invert:()=>Bd,len:()=>Hd,length:()=>pa,lerp:()=>Wd,ln:()=>ua,mul:()=>Vd,multiply:()=>la,normalize:()=>$n,pow:()=>Pd,random:()=>Dd,rotateX:()=>Rd,rotateY:()=>Cd,rotateZ:()=>Ld,rotationTo:()=>$d,scale:()=>ha,set:()=>zd,setAxes:()=>Kd,setAxisAngle:()=>aa,slerp:()=>pi,sqlerp:()=>jd,sqrLen:()=>Jd,squaredLength:()=>fa,str:()=>Fd});var x={};Kt(x,{add:()=>Tu,angle:()=>Wu,bezier:()=>ku,ceil:()=>Mu,clone:()=>yu,copy:()=>_u,create:()=>ci,cross:()=>Cr,dist:()=>Qu,distance:()=>Qs,div:()=>Ku,divide:()=>Ks,dot:()=>Rr,equals:()=>Yu,exactEquals:()=>qu,floor:()=>Su,forEach:()=>td,fromValues:()=>ui,hermite:()=>Iu,inverse:()=>Pu,len:()=>Nn,length:()=>Ys,lerp:()=>Du,max:()=>Au,min:()=>Eu,mul:()=>ju,multiply:()=>js,negate:()=>Xu,normalize:()=>Fn,random:()=>Fu,rotateX:()=>zu,rotateY:()=>Gu,rotateZ:()=>Vu,round:()=>Ru,scale:()=>Cu,scaleAndAdd:()=>Lu,set:()=>wu,slerp:()=>Bu,sqrDist:()=>Zu,sqrLen:()=>ed,squaredDistance:()=>Zs,squaredLength:()=>ea,str:()=>Ju,sub:()=>$u,subtract:()=>$s,transformMat3:()=>Uu,transformMat4:()=>Nu,transformQuat:()=>Ou,zero:()=>Hu});function ci(){var t=new Z(3);return Z!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}u(ci,"create");function yu(t){var r=new Z(3);return r[0]=t[0],r[1]=t[1],r[2]=t[2],r}u(yu,"clone");function Ys(t){var r=t[0],e=t[1],i=t[2];return Math.sqrt(r*r+e*e+i*i)}u(Ys,"length");function ui(t,r,e){var i=new Z(3);return i[0]=t,i[1]=r,i[2]=e,i}u(ui,"fromValues");function _u(t,r){return t[0]=r[0],t[1]=r[1],t[2]=r[2],t}u(_u,"copy");function wu(t,r,e,i){return t[0]=r,t[1]=e,t[2]=i,t}u(wu,"set");function Tu(t,r,e){return t[0]=r[0]+e[0],t[1]=r[1]+e[1],t[2]=r[2]+e[2],t}u(Tu,"add");function $s(t,r,e){return t[0]=r[0]-e[0],t[1]=r[1]-e[1],t[2]=r[2]-e[2],t}u($s,"subtract");function js(t,r,e){return t[0]=r[0]*e[0],t[1]=r[1]*e[1],t[2]=r[2]*e[2],t}u(js,"multiply");function Ks(t,r,e){return t[0]=r[0]/e[0],t[1]=r[1]/e[1],t[2]=r[2]/e[2],t}u(Ks,"divide");function Mu(t,r){return t[0]=Math.ceil(r[0]),t[1]=Math.ceil(r[1]),t[2]=Math.ceil(r[2]),t}u(Mu,"ceil");function Su(t,r){return t[0]=Math.floor(r[0]),t[1]=Math.floor(r[1]),t[2]=Math.floor(r[2]),t}u(Su,"floor");function Eu(t,r,e){return t[0]=Math.min(r[0],e[0]),t[1]=Math.min(r[1],e[1]),t[2]=Math.min(r[2],e[2]),t}u(Eu,"min");function Au(t,r,e){return t[0]=Math.max(r[0],e[0]),t[1]=Math.max(r[1],e[1]),t[2]=Math.max(r[2],e[2]),t}u(Au,"max");function Ru(t,r){return t[0]=Fe(r[0]),t[1]=Fe(r[1]),t[2]=Fe(r[2]),t}u(Ru,"round");function Cu(t,r,e){return t[0]=r[0]*e,t[1]=r[1]*e,t[2]=r[2]*e,t}u(Cu,"scale");function Lu(t,r,e,i){return t[0]=r[0]+e[0]*i,t[1]=r[1]+e[1]*i,t[2]=r[2]+e[2]*i,t}u(Lu,"scaleAndAdd");function Qs(t,r){var e=r[0]-t[0],i=r[1]-t[1],n=r[2]-t[2];return Math.sqrt(e*e+i*i+n*n)}u(Qs,"distance");function Zs(t,r){var e=r[0]-t[0],i=r[1]-t[1],n=r[2]-t[2];return e*e+i*i+n*n}u(Zs,"squaredDistance");function ea(t){var r=t[0],e=t[1],i=t[2];return r*r+e*e+i*i}u(ea,"squaredLength");function Xu(t,r){return t[0]=-r[0],t[1]=-r[1],t[2]=-r[2],t}u(Xu,"negate");function Pu(t,r){return t[0]=1/r[0],t[1]=1/r[1],t[2]=1/r[2],t}u(Pu,"inverse");function Fn(t,r){var e=r[0],i=r[1],n=r[2],o=e*e+i*i+n*n;return o>0&&(o=1/Math.sqrt(o)),t[0]=r[0]*o,t[1]=r[1]*o,t[2]=r[2]*o,t}u(Fn,"normalize");function Rr(t,r){return t[0]*r[0]+t[1]*r[1]+t[2]*r[2]}u(Rr,"dot");function Cr(t,r,e){var i=r[0],n=r[1],o=r[2],s=e[0],a=e[1],l=e[2];return t[0]=n*l-o*a,t[1]=o*s-i*l,t[2]=i*a-n*s,t}u(Cr,"cross");function Du(t,r,e,i){var n=r[0],o=r[1],s=r[2];return t[0]=n+i*(e[0]-n),t[1]=o+i*(e[1]-o),t[2]=s+i*(e[2]-s),t}u(Du,"lerp");function Bu(t,r,e,i){var n=Math.acos(Math.min(Math.max(Rr(r,e),-1),1)),o=Math.sin(n),s=Math.sin((1-i)*n)/o,a=Math.sin(i*n)/o;return t[0]=s*r[0]+a*e[0],t[1]=s*r[1]+a*e[1],t[2]=s*r[2]+a*e[2],t}u(Bu,"slerp");function Iu(t,r,e,i,n,o){var s=o*o,a=s*(2*o-3)+1,l=s*(o-2)+o,c=s*(o-1),d=s*(3-2*o);return t[0]=r[0]*a+e[0]*l+i[0]*c+n[0]*d,t[1]=r[1]*a+e[1]*l+i[1]*c+n[1]*d,t[2]=r[2]*a+e[2]*l+i[2]*c+n[2]*d,t}u(Iu,"hermite");function ku(t,r,e,i,n,o){var s=1-o,a=s*s,l=o*o,c=a*s,d=3*o*a,h=3*l*s,m=l*o;return t[0]=r[0]*c+e[0]*d+i[0]*h+n[0]*m,t[1]=r[1]*c+e[1]*d+i[1]*h+n[1]*m,t[2]=r[2]*c+e[2]*d+i[2]*h+n[2]*m,t}u(ku,"bezier");function Fu(t,r){r=r===void 0?1:r;var e=Ce()*2*Math.PI,i=Ce()*2-1,n=Math.sqrt(1-i*i)*r;return t[0]=Math.cos(e)*n,t[1]=Math.sin(e)*n,t[2]=i*r,t}u(Fu,"random");function Nu(t,r,e){var i=r[0],n=r[1],o=r[2],s=e[3]*i+e[7]*n+e[11]*o+e[15];return s=s||1,t[0]=(e[0]*i+e[4]*n+e[8]*o+e[12])/s,t[1]=(e[1]*i+e[5]*n+e[9]*o+e[13])/s,t[2]=(e[2]*i+e[6]*n+e[10]*o+e[14])/s,t}u(Nu,"transformMat4");function Uu(t,r,e){var i=r[0],n=r[1],o=r[2];return t[0]=i*e[0]+n*e[3]+o*e[6],t[1]=i*e[1]+n*e[4]+o*e[7],t[2]=i*e[2]+n*e[5]+o*e[8],t}u(Uu,"transformMat3");function Ou(t,r,e){var i=e[0],n=e[1],o=e[2],s=e[3],a=r[0],l=r[1],c=r[2],d=n*c-o*l,h=o*a-i*c,m=i*l-n*a;return d=d+d,h=h+h,m=m+m,t[0]=a+s*d+n*m-o*h,t[1]=l+s*h+o*d-i*m,t[2]=c+s*m+i*h-n*d,t}u(Ou,"transformQuat");function zu(t,r,e,i){var n=[],o=[];return n[0]=r[0]-e[0],n[1]=r[1]-e[1],n[2]=r[2]-e[2],o[0]=n[0],o[1]=n[1]*Math.cos(i)-n[2]*Math.sin(i),o[2]=n[1]*Math.sin(i)+n[2]*Math.cos(i),t[0]=o[0]+e[0],t[1]=o[1]+e[1],t[2]=o[2]+e[2],t}u(zu,"rotateX");function Gu(t,r,e,i){var n=[],o=[];return n[0]=r[0]-e[0],n[1]=r[1]-e[1],n[2]=r[2]-e[2],o[0]=n[2]*Math.sin(i)+n[0]*Math.cos(i),o[1]=n[1],o[2]=n[2]*Math.cos(i)-n[0]*Math.sin(i),t[0]=o[0]+e[0],t[1]=o[1]+e[1],t[2]=o[2]+e[2],t}u(Gu,"rotateY");function Vu(t,r,e,i){var n=[],o=[];return n[0]=r[0]-e[0],n[1]=r[1]-e[1],n[2]=r[2]-e[2],o[0]=n[0]*Math.cos(i)-n[1]*Math.sin(i),o[1]=n[0]*Math.sin(i)+n[1]*Math.cos(i),o[2]=n[2],t[0]=o[0]+e[0],t[1]=o[1]+e[1],t[2]=o[2]+e[2],t}u(Vu,"rotateZ");function Wu(t,r){var e=t[0],i=t[1],n=t[2],o=r[0],s=r[1],a=r[2],l=Math.sqrt((e*e+i*i+n*n)*(o*o+s*s+a*a)),c=l&&Rr(t,r)/l;return Math.acos(Math.min(Math.max(c,-1),1))}u(Wu,"angle");function Hu(t){return t[0]=0,t[1]=0,t[2]=0,t}u(Hu,"zero");function Ju(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"}u(Ju,"str");function qu(t,r){return t[0]===r[0]&&t[1]===r[1]&&t[2]===r[2]}u(qu,"exactEquals");function Yu(t,r){var e=t[0],i=t[1],n=t[2],o=r[0],s=r[1],a=r[2];return Math.abs(e-o)<=U*Math.max(1,Math.abs(e),Math.abs(o))&&Math.abs(i-s)<=U*Math.max(1,Math.abs(i),Math.abs(s))&&Math.abs(n-a)<=U*Math.max(1,Math.abs(n),Math.abs(a))}u(Yu,"equals");var $u=$s,ju=js,Ku=Ks,Qu=Qs,Zu=Zs,Nn=Ys,ed=ea,td=(function(){var t=ci();return function(r,e,i,n,o,s){var a,l;for(e||(e=3),i||(i=0),n?l=Math.min(n*e+i,r.length):l=r.length,a=i;a<l;a+=e)t[0]=r[a],t[1]=r[a+1],t[2]=r[a+2],o(t,t,s),r[a]=t[0],r[a+1]=t[1],r[a+2]=t[2];return r}})();var fe={};Kt(fe,{add:()=>Vn,ceil:()=>rd,clone:()=>Un,copy:()=>zn,create:()=>ta,cross:()=>ud,dist:()=>yd,distance:()=>oa,div:()=>xd,divide:()=>na,dot:()=>mi,equals:()=>vd,exactEquals:()=>qn,floor:()=>id,forEach:()=>Md,fromValues:()=>On,inverse:()=>cd,len:()=>wd,length:()=>di,lerp:()=>Jn,max:()=>od,min:()=>nd,mul:()=>bd,multiply:()=>ia,negate:()=>ld,normalize:()=>Hn,random:()=>dd,round:()=>sd,scale:()=>Wn,scaleAndAdd:()=>ad,set:()=>Gn,sqrDist:()=>_d,sqrLen:()=>Td,squaredDistance:()=>sa,squaredLength:()=>hi,str:()=>fd,sub:()=>gd,subtract:()=>ra,transformMat4:()=>hd,transformQuat:()=>md,zero:()=>pd});function ta(){var t=new Z(4);return Z!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}u(ta,"create");function Un(t){var r=new Z(4);return r[0]=t[0],r[1]=t[1],r[2]=t[2],r[3]=t[3],r}u(Un,"clone");function On(t,r,e,i){var n=new Z(4);return n[0]=t,n[1]=r,n[2]=e,n[3]=i,n}u(On,"fromValues");function zn(t,r){return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t}u(zn,"copy");function Gn(t,r,e,i,n){return t[0]=r,t[1]=e,t[2]=i,t[3]=n,t}u(Gn,"set");function Vn(t,r,e){return t[0]=r[0]+e[0],t[1]=r[1]+e[1],t[2]=r[2]+e[2],t[3]=r[3]+e[3],t}u(Vn,"add");function ra(t,r,e){return t[0]=r[0]-e[0],t[1]=r[1]-e[1],t[2]=r[2]-e[2],t[3]=r[3]-e[3],t}u(ra,"subtract");function ia(t,r,e){return t[0]=r[0]*e[0],t[1]=r[1]*e[1],t[2]=r[2]*e[2],t[3]=r[3]*e[3],t}u(ia,"multiply");function na(t,r,e){return t[0]=r[0]/e[0],t[1]=r[1]/e[1],t[2]=r[2]/e[2],t[3]=r[3]/e[3],t}u(na,"divide");function rd(t,r){return t[0]=Math.ceil(r[0]),t[1]=Math.ceil(r[1]),t[2]=Math.ceil(r[2]),t[3]=Math.ceil(r[3]),t}u(rd,"ceil");function id(t,r){return t[0]=Math.floor(r[0]),t[1]=Math.floor(r[1]),t[2]=Math.floor(r[2]),t[3]=Math.floor(r[3]),t}u(id,"floor");function nd(t,r,e){return t[0]=Math.min(r[0],e[0]),t[1]=Math.min(r[1],e[1]),t[2]=Math.min(r[2],e[2]),t[3]=Math.min(r[3],e[3]),t}u(nd,"min");function od(t,r,e){return t[0]=Math.max(r[0],e[0]),t[1]=Math.max(r[1],e[1]),t[2]=Math.max(r[2],e[2]),t[3]=Math.max(r[3],e[3]),t}u(od,"max");function sd(t,r){return t[0]=Fe(r[0]),t[1]=Fe(r[1]),t[2]=Fe(r[2]),t[3]=Fe(r[3]),t}u(sd,"round");function Wn(t,r,e){return t[0]=r[0]*e,t[1]=r[1]*e,t[2]=r[2]*e,t[3]=r[3]*e,t}u(Wn,"scale");function ad(t,r,e,i){return t[0]=r[0]+e[0]*i,t[1]=r[1]+e[1]*i,t[2]=r[2]+e[2]*i,t[3]=r[3]+e[3]*i,t}u(ad,"scaleAndAdd");function oa(t,r){var e=r[0]-t[0],i=r[1]-t[1],n=r[2]-t[2],o=r[3]-t[3];return Math.sqrt(e*e+i*i+n*n+o*o)}u(oa,"distance");function sa(t,r){var e=r[0]-t[0],i=r[1]-t[1],n=r[2]-t[2],o=r[3]-t[3];return e*e+i*i+n*n+o*o}u(sa,"squaredDistance");function di(t){var r=t[0],e=t[1],i=t[2],n=t[3];return Math.sqrt(r*r+e*e+i*i+n*n)}u(di,"length");function hi(t){var r=t[0],e=t[1],i=t[2],n=t[3];return r*r+e*e+i*i+n*n}u(hi,"squaredLength");function ld(t,r){return t[0]=-r[0],t[1]=-r[1],t[2]=-r[2],t[3]=-r[3],t}u(ld,"negate");function cd(t,r){return t[0]=1/r[0],t[1]=1/r[1],t[2]=1/r[2],t[3]=1/r[3],t}u(cd,"inverse");function Hn(t,r){var e=r[0],i=r[1],n=r[2],o=r[3],s=e*e+i*i+n*n+o*o;return s>0&&(s=1/Math.sqrt(s)),t[0]=e*s,t[1]=i*s,t[2]=n*s,t[3]=o*s,t}u(Hn,"normalize");function mi(t,r){return t[0]*r[0]+t[1]*r[1]+t[2]*r[2]+t[3]*r[3]}u(mi,"dot");function ud(t,r,e,i){var n=e[0]*i[1]-e[1]*i[0],o=e[0]*i[2]-e[2]*i[0],s=e[0]*i[3]-e[3]*i[0],a=e[1]*i[2]-e[2]*i[1],l=e[1]*i[3]-e[3]*i[1],c=e[2]*i[3]-e[3]*i[2],d=r[0],h=r[1],m=r[2],p=r[3];return t[0]=h*c-m*l+p*a,t[1]=-(d*c)+m*s-p*o,t[2]=d*l-h*s+p*n,t[3]=-(d*a)+h*o-m*n,t}u(ud,"cross");function Jn(t,r,e,i){var n=r[0],o=r[1],s=r[2],a=r[3];return t[0]=n+i*(e[0]-n),t[1]=o+i*(e[1]-o),t[2]=s+i*(e[2]-s),t[3]=a+i*(e[3]-a),t}u(Jn,"lerp");function dd(t,r){r=r===void 0?1:r;var e,i,n,o,s,a,l;l=Ce(),e=l*2-1,i=(4*Ce()-2)*Math.sqrt(l*-l+l),s=e*e+i*i,l=Ce(),n=l*2-1,o=(4*Ce()-2)*Math.sqrt(l*-l+l),a=n*n+o*o;var c=Math.sqrt((1-s)/a);return t[0]=r*e,t[1]=r*i,t[2]=r*n*c,t[3]=r*o*c,t}u(dd,"random");function hd(t,r,e){var i=r[0],n=r[1],o=r[2],s=r[3];return t[0]=e[0]*i+e[4]*n+e[8]*o+e[12]*s,t[1]=e[1]*i+e[5]*n+e[9]*o+e[13]*s,t[2]=e[2]*i+e[6]*n+e[10]*o+e[14]*s,t[3]=e[3]*i+e[7]*n+e[11]*o+e[15]*s,t}u(hd,"transformMat4");function md(t,r,e){var i=e[0],n=e[1],o=e[2],s=e[3],a=r[0],l=r[1],c=r[2],d=n*c-o*l,h=o*a-i*c,m=i*l-n*a;return d=d+d,h=h+h,m=m+m,t[0]=a+s*d+n*m-o*h,t[1]=l+s*h+o*d-i*m,t[2]=c+s*m+i*h-n*d,t[3]=r[3],t}u(md,"transformQuat");function pd(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t}u(pd,"zero");function fd(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}u(fd,"str");function qn(t,r){return t[0]===r[0]&&t[1]===r[1]&&t[2]===r[2]&&t[3]===r[3]}u(qn,"exactEquals");function vd(t,r){var e=t[0],i=t[1],n=t[2],o=t[3],s=r[0],a=r[1],l=r[2],c=r[3];return Math.abs(e-s)<=U*Math.max(1,Math.abs(e),Math.abs(s))&&Math.abs(i-a)<=U*Math.max(1,Math.abs(i),Math.abs(a))&&Math.abs(n-l)<=U*Math.max(1,Math.abs(n),Math.abs(l))&&Math.abs(o-c)<=U*Math.max(1,Math.abs(o),Math.abs(c))}u(vd,"equals");var gd=ra,bd=ia,xd=na,yd=oa,_d=sa,wd=di,Td=hi,Md=(function(){var t=ta();return function(r,e,i,n,o,s){var a,l;for(e||(e=4),i||(i=0),n?l=Math.min(n*e+i,r.length):l=r.length,a=i;a<l;a+=e)t[0]=r[a],t[1]=r[a+1],t[2]=r[a+2],t[3]=r[a+3],o(t,t,s),r[a]=t[0],r[a+1]=t[1],r[a+2]=t[2],r[a+3]=t[3];return r}})();function Yn(){var t=new Z(4);return Z!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}u(Yn,"create");function Sd(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}u(Sd,"identity");function aa(t,r,e){e=e*.5;var i=Math.sin(e);return t[0]=i*r[0],t[1]=i*r[1],t[2]=i*r[2],t[3]=Math.cos(e),t}u(aa,"setAxisAngle");function Ed(t,r){var e=Math.acos(r[3])*2,i=Math.sin(e/2);return i>U?(t[0]=r[0]/i,t[1]=r[1]/i,t[2]=r[2]/i):(t[0]=1,t[1]=0,t[2]=0),e}u(Ed,"getAxisAngle");function Ad(t,r){var e=ma(t,r);return Math.acos(2*e*e-1)}u(Ad,"getAngle");function la(t,r,e){var i=r[0],n=r[1],o=r[2],s=r[3],a=e[0],l=e[1],c=e[2],d=e[3];return t[0]=i*d+s*a+n*c-o*l,t[1]=n*d+s*l+o*a-i*c,t[2]=o*d+s*c+i*l-n*a,t[3]=s*d-i*a-n*l-o*c,t}u(la,"multiply");function Rd(t,r,e){e*=.5;var i=r[0],n=r[1],o=r[2],s=r[3],a=Math.sin(e),l=Math.cos(e);return t[0]=i*l+s*a,t[1]=n*l+o*a,t[2]=o*l-n*a,t[3]=s*l-i*a,t}u(Rd,"rotateX");function Cd(t,r,e){e*=.5;var i=r[0],n=r[1],o=r[2],s=r[3],a=Math.sin(e),l=Math.cos(e);return t[0]=i*l-o*a,t[1]=n*l+s*a,t[2]=o*l+i*a,t[3]=s*l-n*a,t}u(Cd,"rotateY");function Ld(t,r,e){e*=.5;var i=r[0],n=r[1],o=r[2],s=r[3],a=Math.sin(e),l=Math.cos(e);return t[0]=i*l+n*a,t[1]=n*l-i*a,t[2]=o*l+s*a,t[3]=s*l-o*a,t}u(Ld,"rotateZ");function Xd(t,r){var e=r[0],i=r[1],n=r[2];return t[0]=e,t[1]=i,t[2]=n,t[3]=Math.sqrt(Math.abs(1-e*e-i*i-n*n)),t}u(Xd,"calculateW");function ca(t,r){var e=r[0],i=r[1],n=r[2],o=r[3],s=Math.sqrt(e*e+i*i+n*n),a=Math.exp(o),l=s>0?a*Math.sin(s)/s:0;return t[0]=e*l,t[1]=i*l,t[2]=n*l,t[3]=a*Math.cos(s),t}u(ca,"exp");function ua(t,r){var e=r[0],i=r[1],n=r[2],o=r[3],s=Math.sqrt(e*e+i*i+n*n),a=s>0?Math.atan2(s,o)/s:0;return t[0]=e*a,t[1]=i*a,t[2]=n*a,t[3]=.5*Math.log(e*e+i*i+n*n+o*o),t}u(ua,"ln");function Pd(t,r,e){return ua(t,r),ha(t,t,e),ca(t,t),t}u(Pd,"pow");function pi(t,r,e,i){var n=r[0],o=r[1],s=r[2],a=r[3],l=e[0],c=e[1],d=e[2],h=e[3],m,p,v,f,g;return p=n*l+o*c+s*d+a*h,p<0&&(p=-p,l=-l,c=-c,d=-d,h=-h),1-p>U?(m=Math.acos(p),v=Math.sin(m),f=Math.sin((1-i)*m)/v,g=Math.sin(i*m)/v):(f=1-i,g=i),t[0]=f*n+g*l,t[1]=f*o+g*c,t[2]=f*s+g*d,t[3]=f*a+g*h,t}u(pi,"slerp");function Dd(t){var r=Ce(),e=Ce(),i=Ce(),n=Math.sqrt(1-r),o=Math.sqrt(r);return t[0]=n*Math.sin(2*Math.PI*e),t[1]=n*Math.cos(2*Math.PI*e),t[2]=o*Math.sin(2*Math.PI*i),t[3]=o*Math.cos(2*Math.PI*i),t}u(Dd,"random");function Bd(t,r){var e=r[0],i=r[1],n=r[2],o=r[3],s=e*e+i*i+n*n+o*o,a=s?1/s:0;return t[0]=-e*a,t[1]=-i*a,t[2]=-n*a,t[3]=o*a,t}u(Bd,"invert");function Id(t,r){return t[0]=-r[0],t[1]=-r[1],t[2]=-r[2],t[3]=r[3],t}u(Id,"conjugate");function da(t,r){var e=r[0]+r[4]+r[8],i;if(e>0)i=Math.sqrt(e+1),t[3]=.5*i,i=.5/i,t[0]=(r[5]-r[7])*i,t[1]=(r[6]-r[2])*i,t[2]=(r[1]-r[3])*i;else{var n=0;r[4]>r[0]&&(n=1),r[8]>r[n*3+n]&&(n=2);var o=(n+1)%3,s=(n+2)%3;i=Math.sqrt(r[n*3+n]-r[o*3+o]-r[s*3+s]+1),t[n]=.5*i,i=.5/i,t[3]=(r[o*3+s]-r[s*3+o])*i,t[o]=(r[o*3+n]+r[n*3+o])*i,t[s]=(r[s*3+n]+r[n*3+s])*i}return t}u(da,"fromMat3");function kd(t,r,e,i){var n=arguments.length>4&&arguments[4]!==void 0?arguments[4]:Ns,o=Math.PI/360;r*=o,i*=o,e*=o;var s=Math.sin(r),a=Math.cos(r),l=Math.sin(e),c=Math.cos(e),d=Math.sin(i),h=Math.cos(i);switch(n){case"xyz":t[0]=s*c*h+a*l*d,t[1]=a*l*h-s*c*d,t[2]=a*c*d+s*l*h,t[3]=a*c*h-s*l*d;break;case"xzy":t[0]=s*c*h-a*l*d,t[1]=a*l*h-s*c*d,t[2]=a*c*d+s*l*h,t[3]=a*c*h+s*l*d;break;case"yxz":t[0]=s*c*h+a*l*d,t[1]=a*l*h-s*c*d,t[2]=a*c*d-s*l*h,t[3]=a*c*h+s*l*d;break;case"yzx":t[0]=s*c*h+a*l*d,t[1]=a*l*h+s*c*d,t[2]=a*c*d-s*l*h,t[3]=a*c*h-s*l*d;break;case"zxy":t[0]=s*c*h-a*l*d,t[1]=a*l*h+s*c*d,t[2]=a*c*d+s*l*h,t[3]=a*c*h-s*l*d;break;case"zyx":t[0]=s*c*h-a*l*d,t[1]=a*l*h+s*c*d,t[2]=a*c*d-s*l*h,t[3]=a*c*h+s*l*d;break;default:throw new Error("Unknown angle order "+n)}return t}u(kd,"fromEuler");function Fd(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}u(Fd,"str");var Nd=Un,Ud=On,Od=zn,zd=Gn,Gd=Vn,Vd=la,ha=Wn,ma=mi,Wd=Jn,pa=di,Hd=pa,fa=hi,Jd=fa,$n=Hn,qd=qn;function Yd(t,r){return Math.abs(mi(t,r))>=1-U}u(Yd,"equals");var $d=(function(){var t=ci(),r=ui(1,0,0),e=ui(0,1,0);return function(i,n,o){var s=Rr(n,o);return s<-.999999?(Cr(t,r,n),Nn(t)<1e-6&&Cr(t,e,n),Fn(t,t),aa(i,t,Math.PI),i):s>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(Cr(t,n,o),i[0]=t[0],i[1]=t[1],i[2]=t[2],i[3]=1+s,$n(i,i))}})(),jd=(function(){var t=Yn(),r=Yn();return function(e,i,n,o,s,a){return pi(t,i,s,a),pi(r,n,o,a),pi(e,t,r,2*a*(1-a)),e}})(),Kd=(function(){var t=kn();return function(r,e,i,n){return t[0]=i[0],t[3]=i[1],t[6]=i[2],t[1]=n[0],t[4]=n[1],t[7]=n[2],t[2]=-e[0],t[5]=-e[1],t[8]=-e[2],$n(r,da(r,t))}})();var ce={};Kt(ce,{add:()=>rh,angle:()=>wh,ceil:()=>ih,clone:()=>Qd,copy:()=>eh,create:()=>va,cross:()=>ph,dist:()=>Ph,distance:()=>ya,div:()=>Xh,divide:()=>xa,dot:()=>mh,equals:()=>Ah,exactEquals:()=>Eh,floor:()=>nh,forEach:()=>Ih,fromValues:()=>Zd,inverse:()=>dh,len:()=>Rh,length:()=>wa,lerp:()=>fh,max:()=>sh,min:()=>oh,mul:()=>Lh,multiply:()=>ba,negate:()=>uh,normalize:()=>hh,random:()=>vh,rotate:()=>_h,round:()=>ah,scale:()=>lh,scaleAndAdd:()=>ch,set:()=>th,signedAngle:()=>Th,sqrDist:()=>Dh,sqrLen:()=>Bh,squaredDistance:()=>_a,squaredLength:()=>Ta,str:()=>Sh,sub:()=>Ch,subtract:()=>ga,transformMat2:()=>gh,transformMat2d:()=>bh,transformMat3:()=>xh,transformMat4:()=>yh,zero:()=>Mh});function va(){var t=new Z(2);return Z!=Float32Array&&(t[0]=0,t[1]=0),t}u(va,"create");function Qd(t){var r=new Z(2);return r[0]=t[0],r[1]=t[1],r}u(Qd,"clone");function Zd(t,r){var e=new Z(2);return e[0]=t,e[1]=r,e}u(Zd,"fromValues");function eh(t,r){return t[0]=r[0],t[1]=r[1],t}u(eh,"copy");function th(t,r,e){return t[0]=r,t[1]=e,t}u(th,"set");function rh(t,r,e){return t[0]=r[0]+e[0],t[1]=r[1]+e[1],t}u(rh,"add");function ga(t,r,e){return t[0]=r[0]-e[0],t[1]=r[1]-e[1],t}u(ga,"subtract");function ba(t,r,e){return t[0]=r[0]*e[0],t[1]=r[1]*e[1],t}u(ba,"multiply");function xa(t,r,e){return t[0]=r[0]/e[0],t[1]=r[1]/e[1],t}u(xa,"divide");function ih(t,r){return t[0]=Math.ceil(r[0]),t[1]=Math.ceil(r[1]),t}u(ih,"ceil");function nh(t,r){return t[0]=Math.floor(r[0]),t[1]=Math.floor(r[1]),t}u(nh,"floor");function oh(t,r,e){return t[0]=Math.min(r[0],e[0]),t[1]=Math.min(r[1],e[1]),t}u(oh,"min");function sh(t,r,e){return t[0]=Math.max(r[0],e[0]),t[1]=Math.max(r[1],e[1]),t}u(sh,"max");function ah(t,r){return t[0]=Fe(r[0]),t[1]=Fe(r[1]),t}u(ah,"round");function lh(t,r,e){return t[0]=r[0]*e,t[1]=r[1]*e,t}u(lh,"scale");function ch(t,r,e,i){return t[0]=r[0]+e[0]*i,t[1]=r[1]+e[1]*i,t}u(ch,"scaleAndAdd");function ya(t,r){var e=r[0]-t[0],i=r[1]-t[1];return Math.sqrt(e*e+i*i)}u(ya,"distance");function _a(t,r){var e=r[0]-t[0],i=r[1]-t[1];return e*e+i*i}u(_a,"squaredDistance");function wa(t){var r=t[0],e=t[1];return Math.sqrt(r*r+e*e)}u(wa,"length");function Ta(t){var r=t[0],e=t[1];return r*r+e*e}u(Ta,"squaredLength");function uh(t,r){return t[0]=-r[0],t[1]=-r[1],t}u(uh,"negate");function dh(t,r){return t[0]=1/r[0],t[1]=1/r[1],t}u(dh,"inverse");function hh(t,r){var e=r[0],i=r[1],n=e*e+i*i;return n>0&&(n=1/Math.sqrt(n)),t[0]=r[0]*n,t[1]=r[1]*n,t}u(hh,"normalize");function mh(t,r){return t[0]*r[0]+t[1]*r[1]}u(mh,"dot");function ph(t,r,e){var i=r[0]*e[1]-r[1]*e[0];return t[0]=t[1]=0,t[2]=i,t}u(ph,"cross");function fh(t,r,e,i){var n=r[0],o=r[1];return t[0]=n+i*(e[0]-n),t[1]=o+i*(e[1]-o),t}u(fh,"lerp");function vh(t,r){r=r===void 0?1:r;var e=Ce()*2*Math.PI;return t[0]=Math.cos(e)*r,t[1]=Math.sin(e)*r,t}u(vh,"random");function gh(t,r,e){var i=r[0],n=r[1];return t[0]=e[0]*i+e[2]*n,t[1]=e[1]*i+e[3]*n,t}u(gh,"transformMat2");function bh(t,r,e){var i=r[0],n=r[1];return t[0]=e[0]*i+e[2]*n+e[4],t[1]=e[1]*i+e[3]*n+e[5],t}u(bh,"transformMat2d");function xh(t,r,e){var i=r[0],n=r[1];return t[0]=e[0]*i+e[3]*n+e[6],t[1]=e[1]*i+e[4]*n+e[7],t}u(xh,"transformMat3");function yh(t,r,e){var i=r[0],n=r[1];return t[0]=e[0]*i+e[4]*n+e[12],t[1]=e[1]*i+e[5]*n+e[13],t}u(yh,"transformMat4");function _h(t,r,e,i){var n=r[0]-e[0],o=r[1]-e[1],s=Math.sin(i),a=Math.cos(i);return t[0]=n*a-o*s+e[0],t[1]=n*s+o*a+e[1],t}u(_h,"rotate");function wh(t,r){var e=t[0],i=t[1],n=r[0],o=r[1];return Math.abs(Math.atan2(i*n-e*o,e*n+i*o))}u(wh,"angle");function Th(t,r){var e=t[0],i=t[1],n=r[0],o=r[1];return Math.atan2(e*o-i*n,e*n+i*o)}u(Th,"signedAngle");function Mh(t){return t[0]=0,t[1]=0,t}u(Mh,"zero");function Sh(t){return"vec2("+t[0]+", "+t[1]+")"}u(Sh,"str");function Eh(t,r){return t[0]===r[0]&&t[1]===r[1]}u(Eh,"exactEquals");function Ah(t,r){var e=t[0],i=t[1],n=r[0],o=r[1];return Math.abs(e-n)<=U*Math.max(1,Math.abs(e),Math.abs(n))&&Math.abs(i-o)<=U*Math.max(1,Math.abs(i),Math.abs(o))}u(Ah,"equals");var Rh=wa,Ch=ga,Lh=ba,Xh=xa,Ph=ya,Dh=_a,Bh=Ta,Ih=(function(){var t=va();return function(r,e,i,n,o,s){var a,l;for(e||(e=2),i||(i=0),n?l=Math.min(n*e+i,r.length):l=r.length,a=i;a<l;a+=e)t[0]=r[a],t[1]=r[a+1],o(t,t,s),r[a]=t[0],r[a+1]=t[1];return r}})();var Lr=class Lr{};u(Lr,"CanvasViewport"),Lr.rendererWidth=0,Lr.rendererHeight=0;var Je=Lr;var be=[];for(let t=0;t<256;++t)be.push((t+256).toString(16).slice(1));function Ma(t,r=0){return(be[t[r+0]]+be[t[r+1]]+be[t[r+2]]+be[t[r+3]]+"-"+be[t[r+4]]+be[t[r+5]]+"-"+be[t[r+6]]+be[t[r+7]]+"-"+be[t[r+8]]+be[t[r+9]]+"-"+be[t[r+10]]+be[t[r+11]]+be[t[r+12]]+be[t[r+13]]+be[t[r+14]]+be[t[r+15]]).toLowerCase()}u(Ma,"unsafeStringify");var jn,kh=new Uint8Array(16);function Kn(){if(!jn){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");jn=crypto.getRandomValues.bind(crypto)}return jn(kh)}u(Kn,"rng");var Fh=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),Qn={randomUUID:Fh};function Nh(t,r,e){if(Qn.randomUUID&&!r&&!t)return Qn.randomUUID();t=t||{};let i=t.random??t.rng?.()??Kn();if(i.length<16)throw new Error("Random bytes length must be >= 16");if(i[6]=i[6]&15|64,i[8]=i[8]&63|128,r){if(e=e||0,e<0||e+16>r.length)throw new RangeError(`UUID byte range ${e}:${e+15} is out of buffer bounds`);for(let n=0;n<16;++n)r[e+n]=i[n];return r}return Ma(i)}u(Nh,"v4");var Ze=Nh;var Zn=class Zn{constructor(r){this.name="";if(!r)throw new Error("className is required");this._className=r,this.name=this.name,this._uuid=Ze(),this._serializationIgnoreKeys=["_serializationIgnoreKeys","scene","parent"]}get className(){return this._className}get uuid(){return this._uuid}loopAndSaveProperties(r){let e=typeof r;if(r===null||e==="string"||e==="number"||e==="boolean")return r;if(r&&typeof r.toJsonObject=="function")return r.toJsonObject();if(e==="object"&&!Array.isArray(r)&&r?.constructor===Object){let i={};for(let n in r)Object.prototype.hasOwnProperty.call(r,n)&&(i[n]=this.loopAndSaveProperties(r[n]));return i}}getBaseJsonInfo(){return{type:this.constructor.name,name:this.name,className:this.className,uuid:this.uuid}}serializeAutomatically(){let r={};for(let e of Object.keys(this)){if(this._serializationIgnoreKeys.includes(e))continue;let i=this[e],n=this.loopAndSaveProperties(i);n!==void 0&&(r[e]=n)}return{...r,type:this.constructor.name,name:this.name,className:this.className,uuid:this.uuid}}populateProperties(r,e){for(let i in e){if(!Object.prototype.hasOwnProperty.call(e,i)||!Object.prototype.hasOwnProperty.call(r,i))continue;let n=e[i],o=r[i];n===null||typeof n!="object"?r[i]=n:o&&typeof o.fromJson=="function"?o.fromJson(n):o&&typeof o=="object"&&!Array.isArray(o)&&o.constructor===Object?this.populateProperties(o,n):r[i]=n}}deserializeAutomatically(r){let e={...r},i=["type","name","className","uuid"];for(let n of[...i,...this._serializationIgnoreKeys])delete e[n];this.populateProperties(this,e)}toJsonObject(){return this.getBaseJsonInfo()}fromJson(r){this.name=r.name,r.uuid&&(this._uuid=r.uuid)}};u(Zn,"JsonSerializable");var q=Zn;var eo=class eo extends q{constructor(e,i,n,o,s,a){super("BoundingBox");this.min_x=e;this.max_x=i;this.min_y=n;this.max_y=o;this.min_z=s;this.max_z=a}get width(){return this.max_x-this.min_x}get height(){return this.max_y-this.min_y}get depth(){return this.max_z-this.min_z}};u(eo,"BoundingBox");var fi=eo,to=class to extends q{constructor(e,i,n,o){super("BoundingSphere");this.x=e;this.y=i;this.z=n;this.radius=o}};u(to,"BoundingSphere");var vi=to;var gi=class gi extends q{constructor(e,i=[],n=[],o=[]){super("MeshData");this.providedNormals=!1;this.vertices=e,this.normals=i,this.uvs=n,this.indices=o}static instanciate(e,i=[],n=[],o=[]){return e||(e=[]),new gi(e,i,n,o)}calculateNormals(){if(this.vertices.length===0){console.warn("Cannot calculate normals/indices: Mesh data has no vertices.");return}let e=this.vertices.length;this.normals=Array.from({length:e},()=>x.create());let i=Array.from({length:e},()=>x.create()),n=new Array(e).fill(0);for(let o=0;o<this.indices.length;o+=3){let s=this.indices[o],a=this.indices[o+1],l=this.indices[o+2];if(s>=e||a>=e||l>=e){console.warn(`Invalid index found in triangle ${Math.floor(o/3)}: [${s}, ${a}, ${l}]. Skipping triangle.`);continue}let c=this.vertices[s],d=this.vertices[a],h=this.vertices[l],m=x.sub(x.create(),d,c),p=x.sub(x.create(),h,c),v=x.create();x.cross(v,m,p),x.normalize(v,v),x.add(i[s],i[s],v),n[s]++,x.add(i[a],i[a],v),n[a]++,x.add(i[l],i[l],v),n[l]++}for(let o=0;o<e;o++){let s=i[o],a=n[o];a>0?(x.scale(this.normals[o],s,1/a),x.normalize(this.normals[o],this.normals[o])):x.set(this.normals[o],0,0,0)}}static getBoundingBox(e){if(e.length===0)return null;let i=e[0][0],n=e[0][0],o=e[0][1],s=e[0][1],a=e[0][2],l=e[0][2];for(let c of e){let d=c[0],h=c[1],m=c[2];i=Math.min(i,d),n=Math.max(n,d),o=Math.min(o,h),s=Math.max(s,h),a=Math.min(a,m),l=Math.max(l,m)}return new fi(i,n,o,s,a,l)}static getBoundingSphere(e){if(e.length===0)return null;let i=0,n=0,o=0;for(let m of e)i+=m[0],n+=m[1],o+=m[2];let s=e.length,a=i/s,l=n/s,c=o/s,d=0;for(let m of e){let p=m[0]-a,v=m[1]-l,f=m[2]-c,g=p*p+v*v+f*f;d=Math.max(d,g)}let h=Math.sqrt(d);return new vi(a,l,c,h)}invertNormals(){if(this.normals.length===0){console.warn("No normals to invert: The normals array is empty.");return}for(let e=0;e<this.normals.length;e++)x.negate(this.normals[e],this.normals[e]);console.log("Normals inverted successfully.")}calculateTangentsAndBitangents(){if(!this.indices||this.indices.length===0){console.warn("Cannot calculate tangents/bitangents: Mesh data has no indices.");return}if(!this.uvs||this.uvs.length===0){console.warn("Cannot calculate tangents/bitangents: Mesh data has no UVs.");return}if(!this.normals||this.normals.length===0){console.warn("Cannot calculate tangents/bitangents: Mesh data has no normals.");return}let e=Array.from({length:this.vertices.length},()=>x.create()),i=Array.from({length:this.vertices.length},()=>x.create());for(let n=0;n<this.indices.length;n+=3){let o=this.indices[n],s=this.indices[n+1],a=this.indices[n+2],l=this.vertices[o],c=this.vertices[s],d=this.vertices[a],h=this.uvs[o],m=this.uvs[s],p=this.uvs[a],v=x.sub(x.create(),c,l),f=x.sub(x.create(),d,l),g=ce.sub(ce.create(),m,h),b=ce.sub(ce.create(),p,h),T=g[0]*b[1]-b[0]*g[1],w=Math.abs(T)<1e-6?0:1/T,S=x.create();S[0]=w*(b[1]*v[0]-g[1]*f[0]),S[1]=w*(b[1]*v[1]-g[1]*f[1]),S[2]=w*(b[1]*v[2]-g[1]*f[2]);let M=x.create();M[0]=w*(-b[0]*v[0]+g[0]*f[0]),M[1]=w*(-b[0]*v[1]+g[0]*f[1]),M[2]=w*(-b[0]*v[2]+g[0]*f[2]),x.add(e[o],e[o],S),x.add(e[s],e[s],S),x.add(e[a],e[a],S),x.add(i[o],i[o],M),x.add(i[s],i[s],M),x.add(i[a],i[a],M)}for(let n=0;n<this.vertices.length;++n){let o=this.normals[n],s=e[n];x.scaleAndAdd(s,s,o,-x.dot(o,s)),x.normalize(s,s);let a=i[n];x.cross(a,o,s),x.normalize(a,a)}this.tangents=e,this.bitangents=i}toJsonObject(){return{...super.toJsonObject(),uuid:this.uuid,vertices:this.vertices,normals:this.normals,uvs:this.uvs,indices:this.indices||[],tangents:this.tangents||[],bitangents:this.bitangents||[]}}fromJson(e){super.fromJson(e),this.vertices=e.vertices,this.normals=e.normals,this.uvs=e.uvs,this.indices=e.indices,this.tangents=e.tangents,this.bitangents=e.bitangents}};u(gi,"MeshData");var K=gi,ro=class ro extends q{constructor(){super("Mesh")}toJsonObject(){return{...super.toJsonObject(),meshData:this.meshData.toJsonObject()}}fromJson(r){super.fromJson(r),this.meshData=new K([]),this.meshData.fromJson(r.meshData)}};u(ro,"Mesh");var Xt=ro;var et=class et{static addDependency(r,e,i){et.dependecies[r]=e,i&&(et.metadata[r]=i)}static getDependency(r){return et.dependecies[r]}static instanciateObjectFromJsonData(r,e){if(this.dependecies[r])return e&&e.length>0?this.dependecies[r](...e):this.dependecies[r]();console.warn("[warn] Class Object not found! Implement Class instancing for: ",r)}static getMetadata(r){let e=Object.values(et.metadata);if(!r)return e;let i=Array.isArray(r)?r:[r];return e.filter(n=>i.includes(n.type))}};u(et,"ObjectInstanciator"),et.dependecies={},et.metadata={};var z=et;var io=class io{constructor(r){this.BINDING_POINT=0;this.gl=r,this.ubo=r.createBuffer(),this.data=new Float32Array(32),this.gl.bindBuffer(this.gl.UNIFORM_BUFFER,this.ubo),this.gl.bufferData(this.gl.UNIFORM_BUFFER,this.data.byteLength,this.gl.DYNAMIC_DRAW),this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER,this.BINDING_POINT,this.ubo),this.gl.bindBuffer(this.gl.UNIFORM_BUFFER,null)}update(r,e){this.data.set(r,0),this.data.set(e,16),this.gl.bindBuffer(this.gl.UNIFORM_BUFFER,this.ubo),this.gl.bufferSubData(this.gl.UNIFORM_BUFFER,0,this.data),this.gl.bindBuffer(this.gl.UNIFORM_BUFFER,null)}};u(io,"CameraUBO");var Pt=io;var er=class er extends q{static get className(){return"Color"}static createFromJsonData(r){let e=new er;return e.fromJson(r),e}get r(){return this.vector[0]}set r(r){this.vector[0]=r}get g(){return this.vector[1]}set g(r){this.vector[1]=r}get b(){return this.vector[2]}set b(r){this.vector[2]=r}get a(){return this.vector[3]}set a(r){this.vector[3]=r}constructor(r=1,e=1,i=1,n=1){super("Color"),this.vector=fe.fromValues(r,e,i,n)}toJsonObject(){return{...super.toJsonObject(),r:this.r,g:this.g,b:this.b,a:this.a}}fromJson(r){this.r=r.r,this.g=r.g,this.b=r.b,this.a=r.a}toVec3(){return x.fromValues(this.r,this.g,this.b)}toVec4(){return this.vector}clone(){return new er(...this.vector)}set(r=1,e=1,i=1,n=1){this.vector[0]=r,this.vector[1]=e,this.vector[2]=i,this.vector[3]=n}static lerp(r,e,i){let n=new er;return fe.lerp(n.vector,r.vector,e.vector,i),n}};u(er,"Color");var y=er;var no=class no{static get white(){return new y(1,1,1)}static get black(){return new y(0,0,0)}static get red(){return new y(1,0,0)}static get green(){return new y(0,1,0)}static get blue(){return new y(0,0,1)}static get yellow(){return new y(1,1,0)}static get cyan(){return new y(0,1,1)}static get magenta(){return new y(1,0,1)}static get gray(){return new y(.5,.5,.5)}static get grey(){return new y(.5,.5,.5)}static get clear(){return new y(0,0,0,0)}static get transparent(){return new y(0,0,0,0)}static get cornflowerBlue(){return new y(.392,.584,.929,1)}static get aliceBlue(){return new y(.941,.973,1)}static get antiqueWhite(){return new y(.98,.922,.843)}static get aqua(){return new y(0,1,1)}static get aquamarine(){return new y(.498,1,.831)}static get azure(){return new y(.941,1,1)}static get beige(){return new y(.961,.961,.863)}static get bisque(){return new y(1,.894,.769)}static get blanchedAlmond(){return new y(1,.922,.804)}static get blueViolet(){return new y(.541,.169,.886)}static get brown(){return new y(.647,.165,.165)}static get burlyWood(){return new y(.871,.722,.529)}static get cadetBlue(){return new y(.373,.62,.627)}static get chartreuse(){return new y(.498,1,0)}static get chocolate(){return new y(.824,.412,.118)}static get coral(){return new y(1,.498,.314)}static get crimson(){return new y(.863,.078,.235)}static get darkBlue(){return new y(0,0,.545)}static get darkCyan(){return new y(0,.545,.545)}static get darkGoldenrod(){return new y(.722,.525,.043)}static get darkGray(){return new y(.663,.663,.663)}static get darkGreen(){return new y(0,.392,0)}static get darkKhaki(){return new y(.741,.718,.42)}static get darkMagenta(){return new y(.545,0,.545)}static get darkOliveGreen(){return new y(.333,.42,.184)}static get darkOrange(){return new y(1,.549,0)}static get darkOrchid(){return new y(.6,.196,.8)}static get darkRed(){return new y(.545,0,0)}static get darkSalmon(){return new y(.914,.588,.478)}static get darkSeaGreen(){return new y(.557,.737,.557)}static get darkSlateBlue(){return new y(.282,.239,.545)}static get darkSlateGray(){return new y(.184,.31,.31)}static get darkTurquoise(){return new y(0,.808,.82)}static get darkViolet(){return new y(.58,0,.827)}static get deepPink(){return new y(1,.078,.576)}static get deepSkyBlue(){return new y(0,.749,1)}static get dimGray(){return new y(.412,.412,.412)}static get dodgerBlue(){return new y(.118,.565,1)}static get firebrick(){return new y(.698,.133,.133)}static get floralWhite(){return new y(1,.98,.941)}static get forestGreen(){return new y(.133,.545,.133)}static get fuchsia(){return new y(1,0,1)}static get gainsboro(){return new y(.863,.863,.863)}static get ghostWhite(){return new y(.973,.973,1)}static get gold(){return new y(1,.843,0)}static get goldenrod(){return new y(.855,.647,.125)}static get greenYellow(){return new y(.678,1,.184)}static get honeydew(){return new y(.941,1,.941)}static get hotPink(){return new y(1,.412,.706)}static get indianRed(){return new y(.804,.361,.361)}static get indigo(){return new y(.294,0,.51)}static get ivory(){return new y(1,1,.941)}static get khaki(){return new y(.941,.902,.549)}static get lavender(){return new y(.902,.902,.98)}static get lavenderBlush(){return new y(1,.941,.961)}static get lawnGreen(){return new y(.486,.988,0)}static get lemonChiffon(){return new y(1,.98,.804)}static get lightBlue(){return new y(.678,.847,.902)}static get lightCoral(){return new y(.941,.502,.502)}static get lightCyan(){return new y(.878,1,1)}static get lightGoldenrodYellow(){return new y(.98,.98,.824)}static get lightGray(){return new y(.827,.827,.827)}static get lightGreen(){return new y(.565,.933,.565)}static get lightPink(){return new y(1,.714,.757)}static get lightSalmon(){return new y(1,.627,.478)}static get lightSeaGreen(){return new y(.125,.698,.667)}static get lightSkyBlue(){return new y(.529,.808,.98)}static get lightSlateGray(){return new y(.467,.533,.6)}static get lightSteelBlue(){return new y(.69,.769,.871)}static get lightYellow(){return new y(1,1,.878)}static get lime(){return new y(0,1,0)}static get limeGreen(){return new y(.196,.804,.196)}static get linen(){return new y(.98,.941,.902)}static get maroon(){return new y(.5,0,0)}static get mediumAquamarine(){return new y(.4,.804,.667)}static get mediumBlue(){return new y(0,0,.804)}static get mediumOrchid(){return new y(.729,.333,.827)}static get mediumPurple(){return new y(.576,.439,.859)}static get mediumSeaGreen(){return new y(.235,.702,.443)}static get mediumSlateBlue(){return new y(.482,.408,.933)}static get mediumSpringGreen(){return new y(0,.98,.604)}static get mediumTurquoise(){return new y(.282,.82,.8)}static get mediumVioletRed(){return new y(.78,.082,.522)}static get midnightBlue(){return new y(.098,.098,.439)}static get mintCream(){return new y(.961,1,.98)}static get mistyRose(){return new y(1,.894,.882)}static get moccasin(){return new y(1,.894,.71)}static get navajoWhite(){return new y(1,.871,.678)}static get navy(){return new y(0,0,.5)}static get oldLace(){return new y(.992,.961,.902)}static get olive(){return new y(.5,.5,0)}static get oliveDrab(){return new y(.42,.557,.137)}static get orange(){return new y(1,.647,0)}static get orangeRed(){return new y(1,.271,0)}static get orchid(){return new y(.855,.439,.839)}static get paleGoldenrod(){return new y(.933,.91,.667)}static get paleGreen(){return new y(.596,.984,.596)}static get paleTurquoise(){return new y(.686,.933,.933)}static get paleVioletRed(){return new y(.859,.439,.576)}static get papayaWhip(){return new y(1,.937,.835)}static get peachPuff(){return new y(1,.855,.725)}static get peru(){return new y(.804,.522,.247)}static get pink(){return new y(1,.753,.796)}static get plum(){return new y(.867,.627,.867)}static get powderBlue(){return new y(.69,.878,.902)}static get purple(){return new y(.5,0,.5)}static get rosyBrown(){return new y(.737,.561,.561)}static get royalBlue(){return new y(.255,.412,.882)}static get saddleBrown(){return new y(.545,.271,.075)}static get salmon(){return new y(.98,.502,.447)}static get sandyBrown(){return new y(.957,.643,.376)}static get seaGreen(){return new y(.18,.545,.341)}static get seaShell(){return new y(1,.961,.933)}static get sienna(){return new y(.627,.322,.176)}static get silver(){return new y(.753,.753,.753)}static get skyBlue(){return new y(.529,.808,.922)}static get slateBlue(){return new y(.416,.353,.804)}static get slateGray(){return new y(.439,.5,.565)}static get snow(){return new y(1,.98,.98)}static get springGreen(){return new y(0,1,.498)}static get steelBlue(){return new y(.275,.51,.706)}static get tan(){return new y(.824,.706,.549)}static get teal(){return new y(0,.5,.5)}static get thistle(){return new y(.847,.749,.847)}static get tomato(){return new y(1,.388,.278)}static get turquoise(){return new y(.251,.878,.816)}static get violet(){return new y(.933,.51,.933)}static get wheat(){return new y(.961,.871,.702)}static get whiteSmoke(){return new y(.961,.961,.961)}static get yellowGreen(){return new y(.604,.804,.196)}};u(no,"Colors");var tr=no;var tt=class tt{static getMousePosition(){return{...this.mousePosition}}static getMouseMovement(){return{...this.mouseMovement}}static isMouseButtonDown(r){return this.mouseButtonDown[r]===!0}static getMouseWheelDelta(){return{x:this.wheelX,y:this.wheelY}}};u(tt,"Mouse"),tt.mouseButtonDown={},tt.mouseClickPosition={x:0,y:0},tt.mousePosition={x:0,y:0},tt.mouseMovement={x:0,y:0},tt.wheelX=0,tt.wheelY=0;var ie=tt,rr=class rr{static isKeyDown(r){return this.keyPress[r.toLowerCase()]===!0}static isKeyPressed(r){return this.keyDown[r.toLowerCase()]===!0}static isKeyReleased(r){return this.keyUp[r.toLowerCase()]===!0}};u(rr,"Keybord"),rr.keyDown={},rr.keyUp={},rr.keyPress={};var he=rr,xi=class xi{static get gamepads(){return this._gamepads}static update(){this._gamepads=Array.from(navigator.getGamepads())}};u(xi,"GamepadManager"),xi._gamepads=[];var bi=xi;var oo=class oo extends q{constructor(e,i=0,n=0,o=0){super("Range");this._value=e;this._min=i;this._max=n;this._step=o}toJsonObject(){return{...super.toJsonObject(),min:this._min,max:this._max,step:this._step,value:this._value}}fromJson(e){this.min=e.min,this.max=e.max,this.step=e.step,this.value=e.value}get value(){return this._value}set value(e){this._value=Math.max(this._min,Math.min(this._max,e))}get min(){return this._min}set min(e){this._min=e,this._min>this._max&&(this._max=this._min),this.value=this._value}get max(){return this._max}set max(e){this._max=e,this._max<this._min&&(this._min=this._max),this.value=this._value}get step(){return this._step}set step(e){this._step=e}};u(oo,"NumberRange");var j=oo;var so=class so extends q{constructor(e="Scene Fog"){super("SceneFog");this.name=e;this.enabled=!0;this.fogType=0;this.distance=.01;this.density=.001;this.heightFalloff=0;this.baseHeight=0;this.color=tr.grey}toJsonObject(){return this.serializeAutomatically()}fromJson(e){super.fromJson(e),this.deserializeAutomatically(e)}};u(so,"SceneFog");var yi=so;var _i=class _i extends q{static get className(){return"Vector2"}get vector(){return this._vec}get x(){return this.vector[0]}set x(r){this.vector[0]=r}get y(){return this.vector[1]}set y(r){this.vector[1]=r}constructor(r=0,e=0){super("Vector2"),this._vec=ce.fromValues(r,e)}fromJson(r){super.fromJson(r),this.x=r.x,this.y=r.y}toJsonObject(){return{type:this.constructor.name,className:_i.className,x:this.x,y:this.y}}set(r=0,e=0){this.x=r,this.y=e}};u(_i,"Vector2");var ir=_i,wi=class wi extends ir{constructor(e=0,i=0,n=0){super(e,i);this._className="Vector3";this._vec=x.fromValues(e,i,n)}get vector(){return this._vec}get x(){return this.vector[0]}set x(e){this.vector[0]=e}get y(){return this.vector[1]}set y(e){this.vector[1]=e}get z(){return this.vector[2]}set z(e){this.vector[2]=e}fromJson(e){super.fromJson(e),this.z=e.z}toJsonObject(){return{...super.toJsonObject(),className:wi.className,z:this.z}}set(e=0,i=0,n=0){super.set(e,i),this.z=n}};u(wi,"Vector3");var Be=wi;function ao(t,r){let e=r[0],i=r[1],n=r[2],o=r[3],s=Math.max(-1,Math.min(1,2*(o*i-n*e)));t[0]=Math.atan2(2*(o*e+i*n),1-2*(e*e+i*i)),t[1]=Math.asin(s),t[2]=Math.atan2(2*(o*n+e*i),1-2*(i*i+n*n))}u(ao,"toEuler");var lo=class lo extends q{constructor(){super("Transform");this._parent=null;this._children=[];this._dirty=!0;this.parentEntity=null;this._position=x.create(),this._rotation=X.create(),this._rotationInDegrees=x.create(),this._scale=x.fromValues(1,1,1),this._modelMatrix=E.create(),this._localMatrix=E.create(),this._uuid=Ze(),this._dirty=!0}static get className(){return"Transform"}get modelMatrix(){return this.current}get current(){return this._dirty&&this.updateMatrices(),this._modelMatrix}get localPosition(){return this._position}get localRotation(){return this._rotationInDegrees}get localRotationQuat(){return this._rotation}get localScale(){return this._scale}get worldPosition(){let e=x.create();return E.getTranslation(e,this.current),e}set worldPosition(e){if(this._parent){let i=E.create();E.invert(i,this._parent.modelMatrix),x.transformMat4(this._position,e,i)}else x.copy(this._position,e);this._dirty=!0}get worldRotationQuat(){let e=X.create();return E.getRotation(e,this.current),e}set worldRotationQuat(e){if(this._parent){let i=X.create();X.invert(i,this._parent.worldRotationQuat),X.multiply(this._rotation,i,e)}else X.copy(this._rotation,e);X.normalize(this._rotation,this._rotation),this.updateEulerFromQuat(),this._dirty=!0}get worldRotation(){let e=x.create();return ao(e,this.worldRotationQuat),x.scale(e,e,180/Math.PI),e}set worldRotation(e){let i=X.create();X.fromEuler(i,e[0],e[1],e[2]),this.worldRotationQuat=i}get worldScale(){let e=x.create();return E.getScaling(e,this.current),e}set worldScale(e){if(this._parent){let i=this._parent.worldScale;this._scale[0]=e[0]/i[0],this._scale[1]=e[1]/i[1],this._scale[2]=e[2]/i[2]}else x.copy(this._scale,e);this._dirty=!0}get parent(){return this._parent}get children(){return this._children}setLocalPosition(e=0,i=0,n=0){x.set(this._position,e,i,n),this._dirty=!0}setLocalRotation(e=0,i=0,n=0){x.set(this._rotationInDegrees,e,i,n),X.fromEuler(this._rotation,e,i,n),this._dirty=!0}setLocalScale(e=1,i=1,n=1){x.set(this._scale,e,i,n),this._dirty=!0}setWorldPosition(e=0,i=0,n=0){this.worldPosition=x.fromValues(e,i,n)}setWorldRotation(e=0,i=0,n=0){this.worldRotation=x.fromValues(e,i,n)}setWorldScale(e=1,i=1,n=1){this.worldScale=x.fromValues(e,i,n)}translate(e=0,i=0,n=0){x.add(this._position,this._position,x.fromValues(e,i,n)),this._dirty=!0}rotate(e=0,i=0,n=0){let o=X.create();X.fromEuler(o,e,i,n),X.multiply(this._rotation,this._rotation,o),X.normalize(this._rotation,this._rotation),this.updateEulerFromQuat(),this._dirty=!0}scale(e=1,i=1,n=1){x.multiply(this._scale,this._scale,x.fromValues(e,i,n)),this._dirty=!0}updateMatrices(){let e=this._dirty;e&&(E.fromRotationTranslationScale(this._localMatrix,this._rotation,this._position,this._scale),this._parent?E.multiply(this._modelMatrix,this._parent.current,this._localMatrix):E.copy(this._modelMatrix,this._localMatrix),this._dirty=!1);for(let i of this._children)i.setDirty(e||i._dirty),i.updateMatrices()}setParent(e){if(this._parent){let i=this._parent._children.indexOf(this);i>-1&&this._parent._children.splice(i,1)}this._parent=e,this._parent&&this._parent._children.push(this),this._dirty=!0}get right(){let e=this.current;return x.fromValues(e[0],e[1],e[2])}get left(){return x.negate(x.create(),this.right)}get up(){let e=this.current;return x.fromValues(e[4],e[5],e[6])}get down(){return x.negate(x.create(),this.up)}get forward(){let e=this.current;return x.fromValues(e[8],e[9],e[10])}get back(){return x.negate(x.create(),this.forward)}lookAt(e,i){let n=e instanceof Be?e.vector:e,o=i instanceof Be?i.vector:i||x.fromValues(0,1,0),s=this.worldPosition,a=x.normalize(x.create(),x.sub(x.create(),n,s)),l=x.normalize(x.create(),x.cross(x.create(),o,a)),c=x.cross(x.create(),a,l),d=E.fromValues(l[0],l[1],l[2],0,c[0],c[1],c[2],0,a[0],a[1],a[2],0,s[0],s[1],s[2],1),h=X.create();E.getRotation(h,d),this.worldRotationQuat=h,this._dirty=!0}toJsonObject(){return{...super.toJsonObject(),uuid:this.uuid,parent:this.parent?.uuid,position:[this.localPosition[0],this.localPosition[1],this.localPosition[2]],rotation:[this.localRotation[0],this.localRotation[1],this.localRotation[2]],scale:[this.localScale[0],this.localScale[1],this.localScale[2]]}}fromJson(e){super.fromJson(e),this.setLocalPosition(e.position[0],e.position[1],e.position[2]),this.setLocalRotation(e.rotation[0],e.rotation[1],e.rotation[2]),this.setLocalScale(e.scale[0],e.scale[1],e.scale[2]),this._dirty=!0}rotateByQuat(e){X.multiply(this._rotation,e,this._rotation),X.normalize(this._rotation,this._rotation),this.updateEulerFromQuat(),this._dirty=!0}setDirty(e){this._dirty=e}setLocalRotationQuat(e){X.copy(this._rotation,e),X.normalize(this._rotation,this._rotation),this.updateEulerFromQuat(),this._dirty=!0}updateEulerFromQuat(){let e=x.create();ao(e,this._rotation),x.scale(this._rotationInDegrees,e,180/Math.PI)}getEulerFromQuat(e){let i=x.create();return ao(i,e),x.scale(i,i,180/Math.PI),i}};u(lo,"Transform");var ze=lo;Object.defineProperty(ze.prototype,"position",{get:u(function(){return this.localPosition},"get")});Object.defineProperty(ze.prototype,"rotation",{get:u(function(){return this.localRotation},"get")});Object.defineProperty(ze.prototype,"rotationQuat",{get:u(function(){return this.localRotationQuat},"get")});var Xr=class Xr{};u(Xr,"ShaderSources"),Xr.frag={entity_picker:"assets/shaders/editor/entity-picker.frag",handle:"assets/shaders/editor/handle/handle.frag",entity:"assets/shaders/editor/picker/entity.frag",color:"assets/shaders/frag/color.frag",default_lit:"assets/shaders/frag/default-lit.frag",default_unlit:"assets/shaders/frag/default-unlit.frag",depth_only:"assets/shaders/frag/depth-only.frag",screen_blit:"assets/shaders/frag/screen-blit.frag",skybox:"assets/shaders/frag/skybox.frag",fog:"assets/shaders/functions/fog.frag",functions:"assets/shaders/functions/functions.frag",light:"assets/shaders/functions/light.frag",copy_with_depth:"assets/shaders/post-processing/copy-with-depth.frag",retro:"assets/shaders/post-processing/retro.frag",bitangent:"assets/shaders/tools/bitangent.frag",normal:"assets/shaders/tools/normal.frag",tangent:"assets/shaders/tools/tangent.frag",uv:"assets/shaders/tools/uv.frag"},Xr.vertex={handle:"assets/shaders/editor/handle/handle.vert",entity:"assets/shaders/editor/picker/entity.vert",default:"assets/shaders/vertex/default.vert",fullscreen:"assets/shaders/vertex/fullscreen.vert",screen_quad:"assets/shaders/vertex/screen-quad.vert",shadow_caster:"assets/shaders/vertex/shadow-caster.vert",skybox:"assets/shaders/vertex/skybox.vert"};var ne=Xr;var co=(e=>(e[e.SRC_ALPHA=WebGL2RenderingContext.SRC_ALPHA]="SRC_ALPHA",e[e.ONE=WebGL2RenderingContext.ONE]="ONE",e))(co||{}),uo=(i=>(i[i.ONE_MINUS_SRC_ALPHA=WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA]="ONE_MINUS_SRC_ALPHA",i[i.ONE=WebGL2RenderingContext.ONE]="ONE",i[i.ZERO=WebGL2RenderingContext.ZERO]="ZERO",i))(uo||{});var Uh=(n=>(n[n.Color=WebGL2RenderingContext.COLOR_BUFFER_BIT]="Color",n[n.Depth=WebGL2RenderingContext.DEPTH_BUFFER_BIT]="Depth",n[n.Stencil=WebGL2RenderingContext.STENCIL_BUFFER_BIT]="Stencil",n[n.ColorAndDepth=WebGL2RenderingContext.COLOR_BUFFER_BIT|WebGL2RenderingContext.DEPTH_BUFFER_BIT]="ColorAndDepth",n))(Uh||{});var ho=(i=>(i[i.FRONT=WebGL2RenderingContext.FRONT]="FRONT",i[i.BACK=WebGL2RenderingContext.BACK]="BACK",i[i.NONE=WebGL2RenderingContext.NONE]="NONE",i))(ho||{});var mo=(a=>(a[a.Less=WebGL2RenderingContext.LESS]="Less",a[a.LessOrEqual=WebGL2RenderingContext.LEQUAL]="LessOrEqual",a[a.Greater=WebGL2RenderingContext.GREATER]="Greater",a[a.GreaterOrEqual=WebGL2RenderingContext.GEQUAL]="GreaterOrEqual",a[a.Equal=WebGL2RenderingContext.EQUAL]="Equal",a[a.Always=WebGL2RenderingContext.ALWAYS]="Always",a[a.Never=WebGL2RenderingContext.NEVER]="Never",a))(mo||{});var po=(e=>(e[e.CounterClockwise=WebGL2RenderingContext.CCW]="CounterClockwise",e[e.Clockwise=WebGL2RenderingContext.CW]="Clockwise",e))(po||{});function Pr(){return{center:x.create(),radius:0}}u(Pr,"createSphere");function Dr(t,r=new Float32Array(24)){let e=u((i,n)=>t[n*4+i],"row");for(let i=0;i<6;i++){let n=i>>1,o=i&1?-1:1,s=e(3,0)+o*e(n,0),a=e(3,1)+o*e(n,1),l=e(3,2)+o*e(n,2),c=e(3,3)+o*e(n,3),d=Math.hypot(s,a,l)||1;r[i*4]=s/d,r[i*4+1]=a/d,r[i*4+2]=l/d,r[i*4+3]=c/d}return r}u(Dr,"frustumPlanes");function Br(t,r,e){for(let i=0;i<24;i+=4)if(t[i]*r[0]+t[i+1]*r[1]+t[i+2]*r[2]+t[i+3]<-e)return!1;return!0}u(Br,"sphereInFrustum");var Sa=new WeakMap;function Ea(t){let r=t?.vertices;if(!r?.length)return null;let e=Sa.get(r);if(e)return e;let i=x.fromValues(1/0,1/0,1/0),n=x.fromValues(-1/0,-1/0,-1/0);for(let l of r)x.min(i,i,l),x.max(n,n,l);let o=x.lerp(x.create(),i,n,.5),s=0;for(let l of r)s=Math.max(s,x.squaredDistance(o,l));let a={center:o,radius:Math.sqrt(s)};return Sa.set(r,a),a}u(Ea,"localBoundingSphere");function fo(t){return Math.sqrt(Math.max(t[0]*t[0]+t[1]*t[1]+t[2]*t[2],t[4]*t[4]+t[5]*t[5]+t[6]*t[6],t[8]*t[8]+t[9]*t[9]+t[10]*t[10]))}u(fo,"maxScale");function Aa(t,r,e){return x.transformMat4(t.center,r.center,e),t.radius=r.radius*fo(e),t}u(Aa,"transformSphere");var Ra=E.create(),Ca=new Float32Array(24),vo=Pr();function La(t,r,e,i=!0){let n=r.transform.worldPosition;E.multiply(Ra,r.projectionMatrix,r.viewMatrix),Dr(Ra,Ca);let s=t.objects.filter(c=>c.active&&c.show).map(c=>({entity:c,renderer:c.getBehaviour(_e),distance:x.distance(c.transform.worldPosition,n)})).filter(c=>!!c.renderer),a=u(c=>!i||!c.renderer.worldBounds(vo)||Br(Ca,vo.center,vo.radius),"inView"),l=u(c=>s.filter(d=>d.renderer.renderLayer===c),"layer");return{camera:r,opaque:l(2).filter(a).sort((c,d)=>c.distance-d.distance).map(c=>c.entity),skybox:l(5).map(c=>c.entity),transparent:l(3).filter(a).sort((c,d)=>d.distance-c.distance).map(c=>c.entity),lights:t.lights.filter(c=>c.active&&c.show),shadowCasters:s.filter(c=>c.renderer.castShadows&&c.renderer.renderLayer!==5).map(c=>c.entity),time:e}}u(La,"buildFrameData");var bo=5,Ti=20,nr=20,Oh=1,Xa=(()=>{let t=0,r=u(e=>{let i=t;return t+=e,i},"take");return{ambient:r(1),counts:r(1),dirDirection:r(bo),dirColor:r(bo),pointPosition:r(Ti),pointColor:r(Ti),pointAtten:r(Ti),spotPosition:r(nr),spotDirection:r(nr),spotColor:r(nr),spotCone:r(nr),spotAtten:r(nr),slots:t}})(),zh=[.01,.01,.01,1];function Gh(t,r=new Map,e){let i=Xa,n=e??new Float32Array(i.slots*4);n.fill(0);let o=new Int32Array(n.buffer,n.byteOffset,n.length),s=u((f,g,b,T,_)=>n.set([g,b,T,_],f*4),"set"),a=u(f=>[f.color.r*f.color.a,f.color.g*f.color.a,f.color.b*f.color.a],"intensity"),l=u(f=>r.get(f)??-1,"slotOf"),c=t.find(f=>f.entityType===0);n.set(c?c.color.toVec4():zh,i.ambient*4);let d=t.filter(f=>f.entityType===1).slice(0,bo),h=t.filter(f=>f.entityType===2).slice(0,Ti),m=t.filter(f=>f.entityType===3).slice(0,nr);o.set([d.length,h.length,m.length,0],i.counts*4);let p=x.create();d.forEach((f,g)=>{x.normalize(p,f.direction),s(i.dirDirection+g,p[0],p[1],p[2],0),s(i.dirColor+g,...a(f),l(f))}),h.forEach((f,g)=>{let b=f.transform.worldPosition;s(i.pointPosition+g,b[0],b[1],b[2],f.range),s(i.pointColor+g,...a(f),l(f)),s(i.pointAtten+g,f.attenuation.constant,f.attenuation.linear,f.attenuation.quadratic,0)});let v=Math.PI/180;return m.forEach((f,g)=>{let b=f.transform.worldPosition;x.normalize(p,f.toLightDirection),s(i.spotPosition+g,b[0],b[1],b[2],f.range),s(i.spotDirection+g,p[0],p[1],p[2],0),s(i.spotColor+g,...a(f),l(f)),s(i.spotCone+g,Math.cos(f.coneAngles.inner*v),Math.cos(f.coneAngles.outer*v),0,0),s(i.spotAtten+g,f.attenuation.constant,f.attenuation.linear,f.attenuation.quadratic,0)}),n}u(Gh,"packLights");var xo=class xo{constructor(r){this.gl=r;this.data=new Float32Array(Xa.slots*4);this.buffer=r.createBuffer(),r.bindBuffer(r.UNIFORM_BUFFER,this.buffer),r.bufferData(r.UNIFORM_BUFFER,this.data.byteLength,r.DYNAMIC_DRAW),r.bindBuffer(r.UNIFORM_BUFFER,null)}update(r,e){Gh(r,e,this.data);let i=this.gl;i.bindBuffer(i.UNIFORM_BUFFER,this.buffer),i.bufferSubData(i.UNIFORM_BUFFER,0,this.data),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,Oh,this.buffer)}dispose(){this.gl.deleteBuffer(this.buffer)}};u(xo,"LightsUBO");var Mi=xo;var vt={"assets/shaders/editor/entity-picker.frag":`#version 300 es
precision highp float;

uniform float u_entity_id;
out vec4 fragColor;

void main() { fragColor = vec4(u_entity_id / 255.0, 0.0, 0.0, 1.0); }
`,"assets/shaders/editor/handle/handle.frag":`#version 300 es

precision mediump float;
in vec3 v_position;
out vec4 fragColor;

void main() {
  fragColor = vec4(v_position,1.0);
}
`,"assets/shaders/editor/handle/handle.vert":`#version 300 es

in vec3 a_position;
in mat4 aInstanceModelMatrix; // This attribute will advance once per instance

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

out vec3 v_position;

void main(void) {
  v_position = a_position;
  gl_Position =      uProjectionMatrix * uViewMatrix * aInstanceModelMatrix * vec4(a_position,0);
}
`,"assets/shaders/editor/picker/entity.frag":`#version 300 es
precision highp float;
uniform float u_id;
out vec4 outColor;
void main() { outColor = vec4(u_id / 255.0, 0.0, 0.0, 1.0); }
`,"assets/shaders/editor/picker/entity.vert":`#version 300 es

layout(std140) uniform CameraBlock {
    mat4 u_viewMatrix;
    mat4 u_projectionMatrix;
};

uniform mat4 u_modelMatrix;

in vec4 a_position;

void main() {
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;
}`,"assets/shaders/frag/color.frag":`#version 300 es

precision mediump float;
uniform vec4 u_matColor;
uniform float u_id;

in vec2 v_uv;
out vec4 fragColor;

void main() {
  fragColor = u_matColor;
  if (u_id > 0.0) {
    fragColor = vec4(u_id / 255.0, 0.0, 0.0, 1.0);
  }
}
`,"assets/shaders/frag/default-lit.frag":`#version 300 es
precision highp float;

uniform int u_fogEnabled; 

uniform sampler2D u_mainTex;
uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform float u_emmission;
uniform float u_id;
uniform float u_sid;

in vec2 v_uv;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

@INCLUDE_UTIL_FUNC
@INCLUDE_LIGHT_FUNC
@INCLUDE_FOG_FUNC
void main() {
    vec2 uv = (v_uv * u_uvScale) + u_uvOffset;
    vec4 sampledTexColor = texture(u_mainTex, uv);
    
    // We add a tiny offset (0.0001) to avoid pow(0, ...) undefined behavior in some older drivers
    vec3 linearTexColor = pow(sampledTexColor.rgb + 0.0001, vec3(2.2));
    vec3 linearMatColor = pow(u_matColor.rgb + 0.0001, vec3(2.2)); 
    
    vec4 baseColor = vec4(linearTexColor * linearMatColor, (u_matColor.a * sampledTexColor.a));

    // Lighting calculation (math is now accurately happening in linear space)
    vec3 totalLitColorRGB = calculateTotalLitColor(baseColor.rgb, uv);

    // Linear and unclamped: lights may go above 1 (HDR); the pipeline's final
    // copy tone maps and gamma-encodes.
    vec4 finalColor = vec4(max(totalLitColorRGB, 0.0), baseColor.a);
    vec3 foggedRGB = finalColor.rgb;

    // Fog application (fog math also blends much better in linear space)
    if (u_fogEnabled == 1) {
        vec3 mainLightDir = u_lightCounts.x > 0 ? u_dirDirection[0].xyz : vec3(0.0);
        vec3 mainLightCol = u_lightCounts.x > 0 ? u_dirColor[0].rgb : vec3(0.0);
        
        foggedRGB = applyFog(
            finalColor.rgb, 
            v_fogDistance, 
            v_position, 
            u_cameraPosition, 
            u_lightCounts.x, 
            mainLightDir, 
            mainLightCol
        );
    }
  
    fragColor = vec4(max(foggedRGB, 0.0), finalColor.a);
}`,"assets/shaders/frag/default-unlit.frag":`#version 300 es

precision mediump float;
uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform sampler2D u_mainTex;
uniform float u_id;

in vec2 v_uv;
in vec3 v_position;

out vec4 fragColor;


void main() {
  vec2 uv = v_uv * u_uvScale + u_uvOffset;
  vec4 color = texture(u_mainTex, uv) * u_matColor;
  // Textures and colours are sRGB; the scene is drawn in linear colour and the
  // pipeline's final copy gamma-encodes it.
  fragColor = vec4(pow(color.rgb, vec3(2.2)), color.a);
}
`,"assets/shaders/frag/depth-only.frag":`#version 300 es
precision highp float;

void main() {
    // The main purpose of this shader is to render the depth
    // to the framebuffer. Since we are using a depth texture,
    // we don't need to write anything to fragColor. The depth
    // value is automatically stored by the GPU.
    // So, this main function can be empty.
}
`,"assets/shaders/frag/screen-blit.frag":`#version 300 es
precision mediump float;
in vec2 v_uv;
uniform sampler2D u_screenTexture;
out vec4 fragColor;

void main() {
    // Sample the rendered scene texture
    vec4 texColor = texture(u_screenTexture, v_uv);
    fragColor = vec4(texColor.rgb, 1.0);
}`,"assets/shaders/frag/skybox.frag":`#version 300 es

// highp: the star and cloud hashes need 32-bit floats; mediump is 16-bit on phone GPUs
// and turns the stars into streaks. The hashes themselves avoid sin() (functions.frag).
precision highp float;

// --- GLOBAL SAMPLERS & ENVIRONMENT ---
uniform samplerCube u_mainTex;
uniform vec4 u_matColor;
uniform float u_time;

// --- PROCEDURAL SKY UNIFORMS ---
uniform vec4 u_skyColor;
uniform vec4 u_horizonColor;
uniform vec4 u_groundColor;
uniform float u_exponent;

// --- SUN UNIFORMS ---
uniform int u_useSun;
uniform vec3 u_sunDirection;
uniform vec4 u_sunColor;
uniform float u_sunSize;    
uniform float u_sunFalloff; 

// --- MOON UNIFORMS ---
uniform int u_useMoon;
uniform vec3 u_moonDirection;
uniform vec4 u_moonColor;
uniform float u_moonSize;
uniform float u_moonFalloff;
uniform float u_moonPhase;
uniform float u_moonEarthshine;
uniform float u_moonTerminatorSoftness;
uniform int u_moonEnableRotation;
uniform float u_moonRotationSpeed;

// --- CLOUDS UNIFORMS ---
uniform int u_useClouds;
uniform float u_cloudSeed;
uniform float u_cloudTiling;
uniform float u_weatherCondition;
uniform float u_cloudSparsity;
uniform float u_windCloudSpeed;
uniform float u_cloudSpeed;
uniform int u_cloudRepetition;

// --- STARS UNIFORMS ---
uniform int u_useStars;
uniform float u_starIntensity;
uniform float u_starScale;
uniform float u_starSparsity;
uniform float u_starSpeed;

in vec3 v_viewDirection;
out vec4 fragColor;

// --- EXTERNAL NOISE/UTILITY MACRO ---
@INCLUDE_UTIL_FUNC


// --- GLOBAL WEATHER COMMUNICATOR INTERFACE ---
float g_cloudAlpha = 0.0;
vec3 g_cloudColor  = vec3(0.0);

// --- FUNCTION PROTOTYPES ---
vec3 drawStars(vec3 currentSkyColor, vec3 viewDir);
vec3 drawClouds(vec3 currentSkyColor, vec3 viewDir);
vec3 drawSun(vec3 viewDir);
vec3 drawMoon(vec3 currentSkyColor, vec3 viewDir);

// --- MAIN PIPELINE EXECUTION ---
void main() {
    vec3 viewDir = normalize(v_viewDirection);

    // 1. Sample the background cubemap
    vec4 sampledTexColor = texture(u_mainTex, viewDir);
    
    // 2. Convert from sRGB to Linear Space (Gamma Correction In)
    vec3 linearTexColor = pow(sampledTexColor.rgb + 0.0001, vec3(2.2));
    vec3 linearMatColor = pow(u_matColor.rgb + 0.0001, vec3(2.2));
    vec3 baseTexColor = linearTexColor * linearMatColor;

    // 3. Calculate Procedural Sky Gradient
    float y = viewDir.y;
    float absY = abs(y);
    float p = pow(absY, u_exponent);
    vec3 targetColor = (y > 0.0) ? u_skyColor.rgb : u_groundColor.rgb;
    vec3 gradientColor = mix(u_horizonColor.rgb, targetColor, p);

    // 4. Blend the Texture and the Procedural Gradient
    // Multiplying them tints the cubemap with your procedural sky colors.
    // (If you want the texture to completely overwrite the sky gradient, 
    // change this to: vec3 finalColor = mix(gradientColor, baseTexColor, u_matColor.a);)
    vec3 finalColor = gradientColor * baseTexColor;

    // 5. Apply Procedural Elements
    if(u_useStars == 1 && u_sunDirection.y < 0.0){
       finalColor = drawStars(finalColor, viewDir);
    }
    if(u_useClouds == 1){
      finalColor = drawClouds(finalColor, viewDir); 
    }

    // Sun is only visible when it's above the horizon
    if (u_useSun == 1 && u_sunDirection.y > -0.1) {
        float sunOcclusion = 1.0 - (g_cloudAlpha * 0.95); 
        finalColor += drawSun(viewDir) * sunOcclusion;
    }

    if (u_useMoon == 1 && u_moonDirection.y > -0.1) {
        finalColor = drawMoon(finalColor, viewDir);
    }

    // Linear out: the pipeline's final copy tone maps and gamma-encodes.
    fragColor = vec4(max(finalColor, 0.0), 1.0);
}

// --- RENDERING SUBSYSTEM IMPLEMENTATIONS ---
float calculateMoonTexture(vec3 normal, float frequency) {
    vec3 p = normal * frequency;
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 3; i++) {
        value += amplitude * noise3D(p);
        p *= 2.5; 
        amplitude *= 0.5; 
    }
    return value;
}

vec3 drawStars(vec3 currentSkyColor, vec3 viewDir) {
    if (viewDir.y < 0.0) {
        return currentSkyColor;
    }

    // =========================================================================
    // CONFIGURATION PROPERTIES (STARFIELD SYSTEM)
    // =========================================================================
    const float c_starClusterFreq = 2.9;                          // Frequency scale of the cosmic galaxy banding patterns
    const float c_starClusterCut  = 0.35;                          // Contrast threshold cutoff defining empty space dark voids
    const vec3 c_rotationAxis     = vec3(0.1961, 0.8825, 0.0981); // Pre-normalized 3D directional vector axis of Earth's tilt

    float angle = u_time * u_starSpeed;
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    mat3 rotationMatrix = mat3(
        oc * c_rotationAxis.x * c_rotationAxis.x + c,                    oc * c_rotationAxis.x * c_rotationAxis.y - c_rotationAxis.z * s, oc * c_rotationAxis.x * c_rotationAxis.z + c_rotationAxis.y * s,
        oc * c_rotationAxis.x * c_rotationAxis.y + c_rotationAxis.z * s, oc * c_rotationAxis.y * c_rotationAxis.y + c,                    oc * c_rotationAxis.y * c_rotationAxis.z - c_rotationAxis.x * s,
        oc * c_rotationAxis.x * c_rotationAxis.z - c_rotationAxis.y * s, oc * c_rotationAxis.y * c_rotationAxis.z + c_rotationAxis.x * s, oc * c_rotationAxis.z * c_rotationAxis.z + c
    );

    vec3 rotatedViewDir = rotationMatrix * viewDir;

    vec3 moonDir = normalize(u_moonDirection);
    float moonDot = max(0.0, dot(viewDir, moonDir));
    float d2 = 1.0 - moonDot * moonDot;
    float R2 = 1.0 - u_moonSize * u_moonSize;
    
    if (u_useMoon == 1 && d2 <= R2) {
        return currentSkyColor;
    }

    vec3 starCoord = rotatedViewDir * u_starScale; 
    vec3 i = floor(starCoord);
    vec3 f = fract(starCoord);
    
    float distToCenter = length(f - vec3(0.5));
    float pointMask = smoothstep(0.4, 0.0, distToCenter);

    float nightFactor = smoothstep(0.1, -0.2, u_sunDirection.y); 
    float dynamicExponent = mix(45.0, u_starSparsity, nightFactor);
    
    float rawNoise = hash3D(i);
    float starMask = pow(rawNoise, dynamicExponent) * pointMask; 

    if (starMask <= 0.0) {
        return currentSkyColor;
    }

    float densityNoise = calculateMoonTexture(rotatedViewDir, c_starClusterFreq);
    float densityMask = smoothstep(c_starClusterCut, c_starClusterCut + 0.3, densityNoise);
    starMask *= mix(0.1, 1.0, densityMask);

    float horizonFade = smoothstep(0.04, 0.25, viewDir.y); 
    float dynamicIntensity = mix(0.5, u_starIntensity, nightFactor);
    float finalStarIntensity = starMask * horizonFade * dynamicIntensity;

    float colorSeed = hash3D(i + vec3(12.34, 56.78, 90.12));
    vec3 icyBlue    = vec3(0.75, 0.88, 1.00);
    vec3 warmAmber  = vec3(1.00, 0.92, 0.78);
    vec3 cleanWhite = vec3(0.98, 0.98, 1.00);
    
    vec3 starColor = cleanWhite;
    starColor = mix(starColor, mix(cleanWhite, icyBlue, 0.5), step(colorSeed, 0.35));
    starColor = mix(starColor, mix(cleanWhite, warmAmber, 0.4), step(0.75, colorSeed));

    return max(currentSkyColor, starColor * finalStarIntensity);
}

vec3 drawClouds(vec3 currentSkyColor, vec3 viewDir) {

    if(u_useClouds == 0){
        return currentSkyColor;
    }

    if (viewDir.y < -0.01) {
        return currentSkyColor;
    }

    // =========================================================================
    // CONFIGURATION PROPERTIES (METEOROLOGICAL SYSTEM)
    // =========================================================================
    int rep = 1 + u_cloudRepetition;
    float c_weatherCondition = u_weatherCondition;     // Testing driver loop state (0.0 = Clear, 1.0 = Heavy Storm)
    float c_cloudTiling      = u_cloudTiling;                       // Size/frequency scale of the cloud fractal structures
    vec3 c_cloudSeed         = vec3(209.3  , 128.54 / (100.0 + u_time) , 975.9) + u_time *  u_cloudSpeed; // 3D generation coordinate translation offsets (Procedural Seed)
    float c_maxOpacityClear  = 0.75;                        // Alpha opacity limit clamping factor during standard clear days
    float c_maxOpacityStorm  = 0.98;                        // Alpha opacity limit clamping factor during heavy dark storms
    const float c_zenithPatchWeight= 0.8;                         // Opacity blending mix weight of the overhead zenith dome cap

    // Configurable Color Parameters
    vec3 c_cloudColorDay  = mix(vec3(1.0), u_sunColor.rgb, 0.3);  // Main daylight color highlight profile edge
    vec3 c_cloudShadowDay = u_horizonColor.rgb * 0.8;             // Base undershade color profile for fair weather clouds
    vec3 c_cloudColorRain  = mix(u_horizonColor.rgb * 1.5, vec3(0.75, 0.77, 0.80), 0.3); // Rain highlight color configuration matrix
    vec3 c_cloudShadowRain = mix(u_horizonColor.rgb * 0.8, vec3(0.45, 0.47, 0.50), 0.3); // Rain undershade color configuration matrix

    // =========================================================================

    vec2 cloudUV = viewDir.xz / (viewDir.y + 0.001);
    vec2 windOffset = vec2(u_time * u_windCloudSpeed, u_time * u_windCloudSpeed);
    cloudUV = (cloudUV * c_cloudTiling) + windOffset;

    vec3 pPlanar = vec3(cloudUV.x, 0.0, cloudUV.y) + c_cloudSeed;
    float nPlanar  = 0.500 * noise3D(pPlanar); pPlanar *= 2.05;
    for(int i = 0; i < rep; i++){
        nPlanar       += 0.250 * noise3D(pPlanar); pPlanar *= 1.02;
    }
    nPlanar       += 0.125 * noise3D(pPlanar);
    
    float baseCloudNoise = nPlanar / 0.875;

    vec3 pSpherical = (viewDir * (c_cloudTiling * 2.5)) + vec3(windOffset.x, 0.0, windOffset.y) + c_cloudSeed;
    float nSpherical  = 0.500 * noise3D(pSpherical); pSpherical *= 2.05;
    nSpherical       += 0.250 * noise3D(pSpherical);
    float zenithNoise = nSpherical / 0.750;

    float zenithWeight = pow(viewDir.y, 3.0); 
    float cloudNoise = mix(baseCloudNoise, zenithNoise, zenithWeight * c_zenithPatchWeight);

    float baseDensity = mix(0.75, 0.15, c_weatherCondition);
    float dynamicDensity = clamp(baseDensity + u_cloudSparsity * (1.0 - baseDensity), 0.0, 0.98);
    float dynamicSharpness = mix(0.35, 0.15, c_weatherCondition);
    float cloudCoverage = smoothstep(dynamicDensity, dynamicDensity + dynamicSharpness, cloudNoise);

    float edgeFade = smoothstep(0.01, 0.15, viewDir.y);
    g_cloudAlpha = cloudCoverage * edgeFade;

    if (g_cloudAlpha <= 0.0) {
        return currentSkyColor;
    }

    vec3 currentShadow    = mix(c_cloudShadowDay, c_cloudShadowRain, c_weatherCondition);
    vec3 currentHighlight = mix(c_cloudColorDay, c_cloudColorRain, c_weatherCondition);
    g_cloudColor = mix(currentShadow, currentHighlight, smoothstep(0.2, 0.8, cloudNoise));

    float dynamicMaxOpacity = mix(c_maxOpacityClear, c_maxOpacityStorm, c_weatherCondition);
    return mix(currentSkyColor, g_cloudColor, g_cloudAlpha * dynamicMaxOpacity);
}

vec3 drawSun(vec3 viewDir) {
    // =========================================================================
    // CONFIGURATION PROPERTIES (HELIOCENTRIC LOGIC SUB-SYSTEM)
    // =========================================================================
    const float c_coronaGlowPower = 180.0;                       // Sharpness falloff rate exponent of the tight corona flare halo
    const float c_coronaGlowScale = 0.65;                        // Intensity scale brightness factor of the tight corona halo
    const float c_wideGlarePower  = 12.0;                         // Sharpness falloff rate exponent of the broad screen lens flood
    const float c_wideGlareScale  = 0.25;                         // Intensity scale brightness factor of the broad screen lens flood
    const float c_raySymmetryFreq1= 9.0;                          // Sharpness pattern frequency speed pass 1 for solar ray needles
    const float c_raySymmetryFreq2= 15.0;                         // Sharpness pattern frequency speed pass 2 for structural solar beams
    const float c_raySymmetryFreq3= 4.0;                          // Cross modulation masking frequency mapping break gaps between rays
    const float c_rayFalloffPower = 450.0;                        // Compression distance curve multiplier scaling starburst projections
    const float c_rayIntensityScale = 0.45;                       // Shimmer emission strength scale factor for the directional beams

    vec3 sunDir = normalize(u_sunDirection);
    float sunDot = max(0.0, dot(viewDir, sunDir));
    
    if (sunDot < 0.7) {
        return vec3(0.0);
    }

    float sunCore = smoothstep(u_sunSize - u_sunFalloff, u_sunSize, sunDot);
    float sunGlow = pow(sunDot, c_coronaGlowPower) * c_coronaGlowScale; 
    float wideGlare = pow(sunDot, c_wideGlarePower) * c_wideGlareScale; 
    
    vec3 rayProj = cross(viewDir, sunDir);
    float rayAngle = atan(rayProj.y, rayProj.x);
    float rayPattern = sin(rayAngle * c_raySymmetryFreq1) * sin(rayAngle * c_raySymmetryFreq2 + 1.2) * cos(rayAngle * c_raySymmetryFreq3);
    float sunRays = max(0.0, rayPattern) * pow(sunDot, c_rayFalloffPower) * c_rayIntensityScale;
    
    vec3 coreColor = vec3(1.0, 0.98, 0.95);      
    vec3 edgeColor = vec3(1.0, 0.65, 0.28);      
    vec3 outerHazeColor = vec3(0.92, 0.42, 0.3); 
    
    vec3 mixedSunColor = mix(edgeColor, coreColor, sunCore);
    vec3 finalGlowColor = mix(outerHazeColor, mixedSunColor, smoothstep(0.0, 0.3, sunGlow + sunCore));
    
    return (sunCore * coreColor) + 
           (sunGlow * finalGlowColor) + 
           (sunRays * edgeColor) + 
           (wideGlare * outerHazeColor * u_sunColor.rgb);
}



vec3 drawMoon(vec3 currentSkyColor, vec3 viewDir) {
    // =========================================================================
    // CONFIGURATION PROPERTIES (LUNAR ENVIRONMENT SYSTEM)
    // =========================================================================
    const float c_haloRadiusWiden = 0.015;                      // Mathematical thickness boundary radius of the atmospheric ring
    const float c_haloAlphaWeight = 0.1;                         // Ambient light blending transparency factor for phase glow halos
    const float c_textureFreqBase = 3.5;                          // Octave frequency scale mapping primary lunar craters/maria valleys
    const float c_textureFreqDet  = 12.0;                         // Octave frequency scale mapping secondary high-resolution cracks
    const float c_craterRimCutoff = 0.68;                         // Highpass amplitude filter mask clipping crater wall brightness
    const float c_horizonHazePow  = 2.0;                          // Thickness curve attenuation falloff driving dust horizon fading

    vec3 moonDir = normalize(u_moonDirection);
    float moonDot = max(0.0, dot(viewDir, moonDir));
    
    float d2 = 1.0 - moonDot * moonDot;
    float R2 = 1.0 - u_moonSize * u_moonSize;
    
    float phaseAngle = u_moonPhase * 6.2831853;
    float phaseFade = 1.0;

    float haloOuterRadius = R2 + c_haloRadiusWiden;
    vec3 colorOut = currentSkyColor;
    
    if (d2 > R2 && d2 < haloOuterRadius) {
        float haloFactor = 1.0 - ((d2 - R2) / (haloOuterRadius - R2));
        colorOut = mix(currentSkyColor, u_horizonColor.rgb, c_haloAlphaWeight * haloFactor * phaseFade);
    }

    if (d2 > R2) {
        return colorOut;
    }

    float moonCore = smoothstep(u_moonSize - u_moonFalloff, u_moonSize, moonDot);
    
    float z = sqrt(max(0.0, R2 - d2));
    vec3 N = normalize(viewDir + moonDir * (z - moonDot));
    
    vec3 moonRight = normalize(cross(vec3(0.0, 1.0, 0.0001), moonDir));
    vec3 L = normalize(moonDir * cos(phaseAngle) + moonRight * sin(phaseAngle));
    float moonLighting = smoothstep(-u_moonTerminatorSoftness, u_moonTerminatorSoftness, dot(N, L));
    
    vec3 rotatedN = N;
    if (u_moonEnableRotation == 1) {
        float rotAngle = u_time * u_moonRotationSpeed;
        float rSin = sin(rotAngle);
        float rCos = cos(rotAngle);
        rotatedN.xz = vec2(N.x * rCos - N.z * rSin, N.x * rSin + N.z * rCos);
    }
    
    float baseNoise = calculateMoonTexture(rotatedN, c_textureFreqBase);
    float detailNoise = calculateMoonTexture(rotatedN + vec3(baseNoise * 0.15), c_textureFreqDet);
    float combinedNoise = mix(baseNoise, detailNoise, 0.35);
    
    float mariaMask = smoothstep(0.25, 0.55, combinedNoise);
    vec3 moonBaseColor = mix(u_moonColor.rgb * 0.3, u_moonColor.rgb * 1.1, mariaMask);
    
    float craterRim = smoothstep(c_craterRimCutoff, c_craterRimCutoff + 0.04, detailNoise) * 0.25;
    moonBaseColor += vec3(craterRim);
    
    vec3 moonBodyColor = moonBaseColor * mix(u_moonEarthshine, 1.0, moonLighting);

    float horizonHaze = pow(1.0 - max(0.0, viewDir.y), c_horizonHazePow);
    float atmosphericThickness = mix(0.15, 0.65, horizonHaze);
    moonBodyColor = mix(moonBodyColor, currentSkyColor, atmosphericThickness);

    // Corrected phase logic: full moon should be opaque, new moon should be transparent (or have earthshine).
    float edgeLightingFactor = smoothstep(0.4, 0.6, cos(phaseAngle) * 0.5 + 0.5);
    float moonAlpha = moonCore * mix(u_moonEarthshine, 1.0, edgeLightingFactor);

    vec3 completeMoon = mix(colorOut, moonBodyColor, moonAlpha);
    return mix(completeMoon, g_cloudColor, g_cloudAlpha * 0.9);
}   

`,"assets/shaders/functions/fog.frag":`uniform vec3 u_FogColor;
uniform float u_FogDensity;
uniform int u_fogType; 
uniform float u_FogHeightFalloff; 
uniform float u_FogBaseHeight;    
in float v_fogDistance;


float calculateLinearFogFactor(float distance, float fogStart, float fogEnd) {
    float fogFactor = (distance - fogStart) / (fogEnd - fogStart);
    return clamp(fogFactor, 0.0, 1.0);
}

float calculateExponentialFogFactor(float distance, float fogDensity) {
    float fogFactor = 1.0 - exp(-distance * fogDensity);
    return clamp(fogFactor, 0.0, 1.0);
}

float calculateExponentialSquaredFogFactor(float distance, float fogDensity) {
    float fogFactor = 1.0 - exp(-pow(distance * fogDensity, 2.0));
    return clamp(fogFactor, 0.0, 1.0);
}

vec3 applyLinearFog(vec3 originalColor, vec3 fogColor, float distance, float fogStart, float fogEnd) {
    float fogFactor = calculateLinearFogFactor(distance, fogStart, fogEnd);
    return mix(originalColor, fogColor, fogFactor);
}

vec3 applyExponentialFog(vec3 originalColor, vec3 fogColor, float distance, float fogDensity) {
    float fogFactor = calculateExponentialFogFactor(distance, fogDensity);
    return mix(originalColor, fogColor, fogFactor);
}

vec3 applyExponentialSquaredFog(vec3 originalColor, vec3 fogColor, float distance, float fogDensity) {
    float fogFactor = calculateExponentialSquaredFogFactor(distance, fogDensity);
    return mix(originalColor, fogColor, fogFactor);
}

vec3 applyFog(vec3 originalColor, float distance, vec3 fragPos, vec3 camPos, int numLights, vec3 lightDir, vec3 lightColor) {
    vec3 effectiveFogColor = u_FogColor;

    if (numLights > 0) {
        vec3 viewDir = normalize(fragPos - camPos);
        vec3 lDir = normalize(-lightDir);
        
        float sunInscatter = max(0.0, dot(viewDir, lDir));
        sunInscatter = pow(sunInscatter, 8.0);
        
        effectiveFogColor += lightColor * sunInscatter;
    }

    float heightDelta = max(0.0, fragPos.y - u_FogBaseHeight);
    float heightDensityFactor = exp(-heightDelta * u_FogHeightFalloff);
    float effectiveDensity = u_FogDensity * heightDensityFactor;

    if (u_fogType == 2) {
        return applyExponentialSquaredFog(originalColor, effectiveFogColor, distance, effectiveDensity);
    } else if (u_fogType == 0) {
        return applyLinearFog(originalColor, effectiveFogColor, distance, 1.0 / (effectiveDensity + 0.001), 2.0 / (effectiveDensity + 0.001)); 
    } else {
        return applyExponentialFog(originalColor, effectiveFogColor, distance, effectiveDensity);
    }
}`,"assets/shaders/functions/functions.frag":`
// Hashes without sin() (Dave Hoskins, "Hash without Sine"). The classic
// fract(sin(x) * 43758.5) needs an exact sin() of large arguments: phone GPUs
// (Mali, Adreno) reduce the range with little precision, and the noise turns
// into bands and hard straight lines (the clouds near the horizon, where the
// coordinates are large). These only use fract() and products.
float rand(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float hash3D(vec3 p) {
    vec3 p3 = fract(p * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}

float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    
    vec3 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(mix(hash3D(i + vec3(0.0, 0.0, 0.0)), hash3D(i + vec3(1.0, 0.0, 0.0)), u.x),
                   mix(hash3D(i + vec3(0.0, 1.0, 0.0)), hash3D(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
               mix(mix(hash3D(i + vec3(0.0, 0.0, 1.0)), hash3D(i + vec3(1.0, 0.0, 1.0)), u.x),
                   mix(hash3D(i + vec3(0.0, 1.0, 1.0)), hash3D(i + vec3(1.0, 1.0, 1.0)), u.x), u.y), u.z);
}

`,"assets/shaders/functions/light.frag":`#define MAX_DIRECTIONAL_LIGHTS 5
#define MAX_POINT_LIGHTS 20
#define MAX_SPOT_LIGHTS 20

uniform float u_specularStrength;
uniform float u_roughness;
uniform vec3 u_cameraPosition;
uniform float u_normalMapStrength;

#define MAX_SHADOW_VIEWS 17
#define MAX_SHADOW_SLOTS 7

// Shadow views of the frame, all in one depth atlas (core/render/shadows.ts:
// keep the order and sizes in sync with SHADOWS_LAYOUT).
layout(std140) uniform ShadowsBlock {
    mat4 u_shadowMatrix[MAX_SHADOW_VIEWS];  // world -> light clip space
    vec4 u_shadowRect[MAX_SHADOW_VIEWS];    // atlas uv: x, y, size, size
    vec4 u_shadowParams[MAX_SHADOW_SLOTS];  // texel size, perspective (1/0), 0, first view
    vec4 u_shadowExtra[MAX_SHADOW_SLOTS];   // x: strength (per light)
    vec4 u_shadowAtlas;                     // 1/atlas size, filter taps (1, 4, 16), enabled
};
uniform highp sampler2DShadow u_shadowAtlasMap;
uniform int u_receiveShadows;

uniform sampler2D u_normalMap;
uniform sampler2D u_specularMap;
uniform sampler2D u_roughnessMap;
uniform sampler2D u_aoMap;
uniform sampler2D u_emissiveMap;

// All lights of the frame, uploaded once per frame (core/render/lights-ubo.ts:
// keep the order and sizes in sync with LIGHTS_LAYOUT).
layout(std140) uniform LightsBlock {
    vec4 u_lightAmbient;
    ivec4 u_lightCounts;                        // x directional, y point, z spot
    vec4 u_dirDirection[MAX_DIRECTIONAL_LIGHTS];
    vec4 u_dirColor[MAX_DIRECTIONAL_LIGHTS];    // w: shadow slot (-1 none)
    vec4 u_pointPosition[MAX_POINT_LIGHTS];     // w: range
    vec4 u_pointColor[MAX_POINT_LIGHTS];        // w: shadow slot
    vec4 u_pointAtten[MAX_POINT_LIGHTS];        // constant, linear, quadratic
    vec4 u_spotPosition[MAX_SPOT_LIGHTS];       // w: range
    vec4 u_spotDirection[MAX_SPOT_LIGHTS];
    vec4 u_spotColor[MAX_SPOT_LIGHTS];          // w: shadow slot
    vec4 u_spotCone[MAX_SPOT_LIGHTS];           // cos inner, cos outer
    vec4 u_spotAtten[MAX_SPOT_LIGHTS];
};

// Face of a point light's cube for a direction from the light: +X -X +Y -Y +Z -Z
// (same rule as cubeFaceFor in shadows.ts).
int cubeFace(vec3 v) {
    vec3 a = abs(v);
    if (a.x >= a.y && a.x >= a.z) return v.x > 0.0 ? 0 : 1;
    if (a.y >= a.z) return v.y > 0.0 ? 2 : 3;
    return v.z > 0.0 ? 4 : 5;
}

// PCF inside one atlas tile: 1 tap (hard), 4 taps on a grid, or 16 rotated
// Poisson taps; each tap is a hardware 2x2 comparison. Returns 1 lit, 0 shadowed.
float sampleShadowView(int view, vec3 position, float depthBias) {
    vec4 clip = u_shadowMatrix[view] * vec4(position, 1.0);
    if (clip.w <= 0.0) return 1.0;
    vec3 p = clip.xyz / clip.w * 0.5 + 0.5;
    if (p.z > 1.0 || p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) return 1.0;

    vec2 poissonDisk[16] = vec2[](
        vec2(-0.94201624, -0.39906216), vec2(0.94558609, -0.76890725),
        vec2(-0.09418410, -0.92938870), vec2(0.34495938, 0.29387760),
        vec2(-0.91588581, 0.45778432), vec2(-0.81544232, -0.87912464),
        vec2(-0.38277543, 0.27676845), vec2(0.97484398, 0.75648379),
        vec2(0.44323325, -0.97511554), vec2(0.53742981, -0.47373420),
        vec2(-0.26496911, -0.41893023), vec2(0.79197514, 0.19090188),
        vec2(-0.24188840, 0.99706507), vec2(-0.81409555, 0.14304622),
        vec2(0.19984126, 0.78641367), vec2(0.14383161, -0.14100790)
    );

    vec4 rect = u_shadowRect[view];
    float texel = u_shadowAtlas.x;
    // Stay a texel and a half inside the tile so no tap reads the neighbour.
    vec2 lo = rect.xy + vec2(texel * 1.5);
    vec2 hi = rect.xy + rect.zw - vec2(texel * 1.5);
    vec2 uv = rect.xy + p.xy * rect.zw;
    float ref = p.z - depthBias;

    int taps = int(u_shadowAtlas.y + 0.5);
    if (taps <= 1) return texture(u_shadowAtlasMap, vec3(clamp(uv, lo, hi), ref));
    if (taps <= 4) {
        float sum = 0.0;
        sum += texture(u_shadowAtlasMap, vec3(clamp(uv + vec2(-0.5, -0.5) * texel * 2.0, lo, hi), ref));
        sum += texture(u_shadowAtlasMap, vec3(clamp(uv + vec2( 0.5, -0.5) * texel * 2.0, lo, hi), ref));
        sum += texture(u_shadowAtlasMap, vec3(clamp(uv + vec2(-0.5,  0.5) * texel * 2.0, lo, hi), ref));
        sum += texture(u_shadowAtlasMap, vec3(clamp(uv + vec2( 0.5,  0.5) * texel * 2.0, lo, hi), ref));
        return sum * 0.25;
    }
    float radius = texel * 2.5;

    float angle = rand(p.xy) * 6.283185;
    float c = cos(angle);
    float s = sin(angle);
    float lit = 0.0;
    for (int i = 0; i < 16; i++) {
        vec2 o = vec2(poissonDisk[i].x * c - poissonDisk[i].y * s, poissonDisk[i].x * s + poissonDisk[i].y * c);
        lit += texture(u_shadowAtlasMap, vec3(clamp(uv + o * radius, lo, hi), ref));
    }
    return lit / 16.0;
}

// Light reaching a point from shadow slot \`slotF\` (-1: no shadow).
// lightPos (unused for directional lights) gives the distance for a
// perspective view's texel size and picks a point light's cube face.
float shadowFactor(float slotF, vec3 normal, vec3 toLight, vec3 lightPos, bool isPoint) {
    int slot = int(slotF);
    if (slot < 0 || u_receiveShadows == 0 || u_shadowAtlas.z < 0.5) return 1.0;
    vec4 prm = u_shadowParams[slot];
    vec4 extra = u_shadowExtra[slot];
    // World size of a shadow-map texel here: the biases are in texels, so they
    // stay just big enough against acne and the shadow keeps touching its object.
    float texel = prm.y > 0.5 ? prm.x * length(v_position - lightPos) : prm.x;
    float ndotl = clamp(dot(normal, toLight), 0.0, 1.0);
    // The normal offset is for grazing angles, where acne appears first.
    float sinAngle = sqrt(1.0 - ndotl * ndotl);
    vec3 position = v_position + normal * (extra.z * texel * sinAngle) + toLight * (extra.y * texel);
    int view = int(prm.w) + (isPoint ? cubeFace(v_position - lightPos) : 0);
    float lit = sampleShadowView(view, position, 0.0);
    return mix(1.0, lit, extra.x);
}

vec3 getFinalNormal(vec2 uv) {
    vec3 n = normalize(v_normal);
    
    if (u_normalMapStrength > 0.0) {
        if (length(v_tangent) > 0.0001 && length(v_bitangent) > 0.0001) {
            vec3 normalFromMap = texture(u_normalMap, uv).rgb * 2.0 - 1.0;
            mat3 tbnMatrix = mat3(normalize(v_tangent), normalize(v_bitangent), n);
            vec3 perturbedNormal = tbnMatrix * normalFromMap;
            return normalize(mix(n, normalize(perturbedNormal), u_normalMapStrength));
        }
    }
    return n;
}

vec2 calculateBlinnPhong(vec3 lightDir, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    float diffuseIntensity = max(dot(normal, lightDir), 0.0);
    float specularIntensity = 0.0;
    
    if (diffuseIntensity > 0.0) {
        vec3 halfVecSum = lightDir + viewDir;
        vec3 halfVec = length(halfVecSum) > 0.0001 ? normalize(halfVecSum) : normal;
        specularIntensity = pow(max(0.0, dot(normal, halfVec)), shininess) * specStrength;
    }
    return vec2(diffuseIntensity, specularIntensity);
}

vec3 applyDirectionalLight(int index, vec3 baseColor, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    vec3 lightDir = normalize(-u_dirDirection[index].xyz);
    vec2 intensities = calculateBlinnPhong(lightDir, viewDir, normal, shininess, specStrength);
    
    if (intensities.x <= 0.0) return vec3(0.0);

    float shadow = shadowFactor(u_dirColor[index].w, normal, lightDir, vec3(0.0), false);

    vec3 diffuse = baseColor * intensities.x;
    vec3 specular = vec3(1.0) * intensities.y;
    return (diffuse + specular) * u_dirColor[index].rgb * shadow;
}

// Smooth cut-off at the light's range (Frostbite / UE4 windowing): 1 near the
// light, 0 at the range, so a light only colours what is inside its range.
float rangeWindow(float distance, float range) {
    if (range <= 0.0) return 1.0;
    float r = distance / range;
    float w = clamp(1.0 - r * r * r * r, 0.0, 1.0);
    return w * w;
}

vec3 applyPointLight(int index, vec3 baseColor, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    vec3 lightVec = u_pointPosition[index].xyz - v_position;
    vec3 lightDir = normalize(lightVec);

    vec2 intensities = calculateBlinnPhong(lightDir, viewDir, normal, shininess, specStrength);
    if (intensities.x <= 0.0) return vec3(0.0);

    float distance = length(lightVec);
    float attenuation = 1.0 / (u_pointAtten[index].x +
                               u_pointAtten[index].y * distance +
                               u_pointAtten[index].z * (distance * distance));
    attenuation *= rangeWindow(distance, u_pointPosition[index].w);

    vec3 diffuse = baseColor * intensities.x;
    vec3 specular = vec3(1.0) * intensities.y;
    float shadow = shadowFactor(u_pointColor[index].w, normal, lightDir, u_pointPosition[index].xyz, true);

    return (diffuse + specular) * u_pointColor[index].rgb * attenuation * shadow;
}

vec3 applySpotLight(int index, vec3 baseColor, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    vec3 lightVec = u_spotPosition[index].xyz - v_position;
    vec3 lightDir = normalize(lightVec);

    vec2 intensities = calculateBlinnPhong(lightDir, viewDir, normal, shininess, specStrength);
    if (intensities.x <= 0.0) return vec3(0.0);

    float angleCos = dot(lightDir, -u_spotDirection[index].xyz);
    float coneFactor = smoothstep(u_spotCone[index].y, u_spotCone[index].x, angleCos);
    
    if (coneFactor <= 0.0) return vec3(0.0);

    float distance = length(lightVec);
    float attenuation = 1.0 / (u_spotAtten[index].x +
                               u_spotAtten[index].y * distance +
                               u_spotAtten[index].z * (distance * distance));
    attenuation *= rangeWindow(distance, u_spotPosition[index].w);
    
    vec3 diffuse = baseColor * intensities.x;
    vec3 specular = vec3(1.0) * intensities.y;
    float shadow = shadowFactor(u_spotColor[index].w, normal, lightDir, u_spotPosition[index].xyz, false);

    return (diffuse + specular) * u_spotColor[index].rgb * attenuation * coneFactor * shadow;
}

vec3 calculateTotalLitColor(vec3 baseColor, vec2 uv) {
    vec3 finalNormal = getFinalNormal(uv);
    
    vec3 cameraDelta = u_cameraPosition - v_position;
    vec3 viewDir = length(cameraDelta) > 0.0001 ? normalize(cameraDelta) : vec3(0.0, 0.0, 1.0);
    
    float sampledSpecular = texture(u_specularMap, uv).r;
    float sampledRoughness = texture(u_roughnessMap, uv).r;
    
    float finalRoughness = sampledRoughness * u_roughness;
    
    // Fade out specular intensity completely on rough surfaces to prevent the milky wash
    float finalSpecularStrength = sampledSpecular * u_specularStrength * (1.0 - finalRoughness);
    
    float clampedRoughness = clamp(finalRoughness * finalRoughness, 0.001, 0.999);
    float shininess = (2.0 / clampedRoughness) - 2.0;

    float ao = texture(u_aoMap, uv).r;
    vec3 emissive = texture(u_emissiveMap, uv).rgb;

    vec3 totalLitColorRGB = (u_lightAmbient.rgb * baseColor * ao) + emissive;

    for (int i = 0; i < u_lightCounts.x; ++i) {
        totalLitColorRGB += applyDirectionalLight(i, baseColor, viewDir, finalNormal, shininess, finalSpecularStrength);
    }

    for (int i = 0; i < u_lightCounts.y; ++i) {
        totalLitColorRGB += applyPointLight(i, baseColor, viewDir, finalNormal, shininess, finalSpecularStrength);
    }

    for (int i = 0; i < u_lightCounts.z; ++i) {
        totalLitColorRGB += applySpotLight(i, baseColor, viewDir, finalNormal, shininess, finalSpecularStrength);
    }
    
    return totalLitColorRGB;
}`,"assets/shaders/post-processing/copy-with-depth.frag":`#version 300 es
precision highp float;

// Final copy of the scene to the bound framebuffer. The scene is drawn in
// linear colour (HDR targets can hold values above 1): this applies the
// exposure, the tone mapping, the saturation, the sRGB gamma and the contrast, and writes depth through
// gl_FragDepth, so what is drawn afterwards (editor grid, gizmos) is still
// hidden by the scene's objects.
in vec2 v_uv;
uniform sampler2D u_color;
uniform highp sampler2D u_depth;
uniform int u_toneMapping;   // 0 none (clamp), 1 Reinhard, 2 ACES (Narkowicz fit)
uniform float u_exposure;
uniform float u_saturation;  // 1 unchanged, 0 grey
uniform float u_contrast;    // 1 unchanged, around mid grey after gamma
out vec4 fragColor;

vec3 aces(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
    vec4 color = texture(u_color, v_uv);
    vec3 rgb = color.rgb * u_exposure;
    if (u_toneMapping == 1) rgb = rgb / (1.0 + rgb);
    else if (u_toneMapping == 2) rgb = aces(rgb);
    rgb = clamp(rgb, 0.0, 1.0);
    float luma = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
    rgb = max(mix(vec3(luma), rgb, u_saturation), 0.0);
    vec3 srgb = pow(clamp(rgb, 0.0, 1.0), vec3(1.0 / 2.2));
    srgb = (srgb - 0.5) * u_contrast + 0.5;
    fragColor = vec4(clamp(srgb, 0.0, 1.0), color.a);
    gl_FragDepth = texture(u_depth, v_uv).r;
}
`,"assets/shaders/post-processing/retro.frag":`#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_screenTexture;
uniform float u_time;
uniform float u_distortionStrength; // Try 0.15
uniform float u_aberrationSpread;   // Try 0.008

void main() {
    // 1. CRT Barrel Distortion
    // Shift UVs to center (-0.5 to 0.5) to calculate radial distance
    vec2 centeredUv = v_uv - 0.5;
    float distanceSquared = dot(centeredUv, centeredUv);
    
    // Distort UVs based on distance from center
    vec2 distortedUv = v_uv + centeredUv * (distanceSquared * u_distortionStrength);

    // 2. Chromatic Aberration
    // Sample the RGB channels at slightly different horizontal offsets
    float r = texture(u_screenTexture, distortedUv - vec2(u_aberrationSpread, 0.0)).r;
    float g = texture(u_screenTexture, distortedUv).g;
    float b = texture(u_screenTexture, distortedUv + vec2(u_aberrationSpread, 0.0)).b;

    // 3. Scanlines (using sine wave over the Y axis)
    // Multiply by a large number (like 800) to create thin horizontal lines
    float scanline = sin(distortedUv.y * 800.0 + u_time * 5.0) * 0.04;

    // Outside the distorted screen: black, like the bezel of a CRT.
    if (distortedUv.x < 0.0 || distortedUv.x > 1.0 || distortedUv.y < 0.0 || distortedUv.y > 1.0) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    // Combine into final color, darkening slightly with the scanline
    fragColor = vec4(vec3(r, g, b) - scanline, 1.0);
}`,"assets/shaders/tools/bitangent.frag":`#version 300 es
precision mediump float;

#define MAX_DIRECTIONAL_LIGHTS 5 // Max number of directional lights
#define MAX_POINT_LIGHTS 20       // Max number of point lights
#define MAX_SPOT_LIGHTS 20        // Max number of spot lights

uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform sampler2D u_mainTex;
uniform sampler2D u_normalMap; // New: Uniform for the normal map texture



in vec2 v_uv;
in vec3 v_normal; // Interpolated normal (from vertex shader)
in vec3 v_position; // Crucial for point and spot lights: fragment's world position
// New: Tangent and Bitangent vectors from the vertex shader for TBN matrix
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

void main() {
  vec2 uv = (v_uv * u_uvScale) + u_uvOffset;
 fragColor = vec4(v_bitangent,1);
}
`,"assets/shaders/tools/normal.frag":`#version 300 es
precision mediump float;

#define MAX_DIRECTIONAL_LIGHTS 5 // Max number of directional lights
#define MAX_POINT_LIGHTS 20       // Max number of point lights
#define MAX_SPOT_LIGHTS 20        // Max number of spot lights

uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform sampler2D u_mainTex;
uniform sampler2D u_normalMap; // New: Uniform for the normal map texture



in vec2 v_uv;
in vec3 v_normal; // Interpolated normal (from vertex shader)
in vec3 v_position; // Crucial for point and spot lights: fragment's world position
// New: Tangent and Bitangent vectors from the vertex shader for TBN matrix
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

void main() {
  vec2 uv = (v_uv * u_uvScale) + u_uvOffset;

  vec4 sampledTexColor = texture(u_mainTex, uv);
  vec4 baseColor = sampledTexColor * u_matColor;


  // fragColor = vec4(uv,0,1);
  fragColor = vec4(v_normal,1);
  // fragColor = vec4(v_bitangent,1);
  // fragColor = vec4(v_tangent * 0.5 + 0.5, 1.0);
  // fragColor = vec4(v_bitangent * 0.5 + 0.5, 1.0);

}
`,"assets/shaders/tools/tangent.frag":`#version 300 es
precision mediump float;

#define MAX_DIRECTIONAL_LIGHTS 5 // Max number of directional lights
#define MAX_POINT_LIGHTS 20       // Max number of point lights
#define MAX_SPOT_LIGHTS 20        // Max number of spot lights

uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform sampler2D u_mainTex;
uniform sampler2D u_normalMap; // New: Uniform for the normal map texture



in vec2 v_uv;
in vec3 v_normal; // Interpolated normal (from vertex shader)
in vec3 v_position; // Crucial for point and spot lights: fragment's world position
// New: Tangent and Bitangent vectors from the vertex shader for TBN matrix
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

void main() {
  vec2 uv = (v_uv * u_uvScale) + u_uvOffset;
  fragColor = vec4(v_tangent, 1.0);
}
`,"assets/shaders/tools/uv.frag":`#version 300 es
precision mediump float;

#define MAX_DIRECTIONAL_LIGHTS 5 // Max number of directional lights
#define MAX_POINT_LIGHTS 20       // Max number of point lights
#define MAX_SPOT_LIGHTS 20        // Max number of spot lights

uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform sampler2D u_mainTex;
uniform sampler2D u_normalMap; // New: Uniform for the normal map texture



in vec2 v_uv;
in vec3 v_normal; // Interpolated normal (from vertex shader)
in vec3 v_position; // Crucial for point and spot lights: fragment's world position
// New: Tangent and Bitangent vectors from the vertex shader for TBN matrix
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

void main() {
  vec2 uv = (v_uv * u_uvScale) + u_uvOffset;

  vec4 sampledTexColor = texture(u_mainTex, uv);
  vec4 baseColor = sampledTexColor * u_matColor;


  fragColor = vec4(uv,0,1);

}
`,"assets/shaders/vertex/default.vert":`#version 300 es

// This replaces individual camera uniforms
layout(std140) uniform CameraBlock {
    mat4 u_viewMatrix;
    mat4 u_projectionMatrix;
};

uniform mat4 u_worldMatrix;
uniform mat3 u_worldInverseTransposeMatrix;

uniform float u_time;
uniform vec2 u_screenResolution;

uniform float u_fogDistance;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;
in vec3 a_tangent;
in vec3 a_bitangent;

#ifdef SKINNED
// Skinning: 4 joints per vertex; the joint matrices are rows of a float
// texture, 4 texels (columns) per joint, written by SkinnedMeshRendererBehaviour.
in uvec4 a_joints;
in vec4 a_weights;
uniform highp sampler2D u_jointTexture;

mat4 jointMatrix(uint joint) {
  int row = int(joint);
  return mat4(
    texelFetch(u_jointTexture, ivec2(0, row), 0),
    texelFetch(u_jointTexture, ivec2(1, row), 0),
    texelFetch(u_jointTexture, ivec2(2, row), 0),
    texelFetch(u_jointTexture, ivec2(3, row), 0));
}

mat4 skinMatrix() {
  return a_weights.x * jointMatrix(a_joints.x)
       + a_weights.y * jointMatrix(a_joints.y)
       + a_weights.z * jointMatrix(a_joints.z)
       + a_weights.w * jointMatrix(a_joints.w);
}
#endif

// Outputs to the fragment shader
out vec2 v_uv;
out vec3 v_normal;
out vec3 v_position;
out vec3 v_position_view;
out vec3 v_tangent;
out vec3 v_bitangent;
out float v_fogDistance;

void main() {
  vec4 localPosition = vec4(a_position, 1.0);
  vec3 localNormal = a_normal;
  vec3 localTangent = a_tangent;
  vec3 localBitangent = a_bitangent;
#ifdef SKINNED
  // Joint matrices are in mesh space, so the world matrices apply after.
  // mat3(skin) is right for normals while bones have no non-uniform scale.
  mat4 skin = skinMatrix();
  localPosition = skin * localPosition;
  localNormal = mat3(skin) * localNormal;
  localTangent = mat3(skin) * localTangent;
  localBitangent = mat3(skin) * localBitangent;
#endif

  // Standard vertex transformations
  vec4 worldPosition = u_worldMatrix * localPosition;
  
  vec4 viewPosition = u_viewMatrix * worldPosition;

  v_position = worldPosition.xyz;
  v_position_view = viewPosition.xyz;
  v_normal = u_worldInverseTransposeMatrix * localNormal;
  v_tangent = u_worldInverseTransposeMatrix * localTangent;
  v_bitangent = u_worldInverseTransposeMatrix * localBitangent;
  v_uv = a_uv;

  // Calculate the distance for fog (using true radial distance from the camera)
  v_fogDistance = length(viewPosition.xyz) + u_fogDistance;

  // We multiply the matrices in order (Projection * View * Model) directly in the shader
  gl_Position = u_projectionMatrix * viewPosition;
  gl_PointSize = 10.0;
}`,"assets/shaders/vertex/fullscreen.vert":`#version 300 es
out vec2 v_uv;

// Generate a full-screen triangle using the gl_VertexID trick
void main() {
    // Calculate vertices entirely on the GPU
    float x = float((gl_VertexID & 1) << 2) - 1.0;
    float y = float((gl_VertexID & 2) << 1) - 1.0;
    
    // Map the -1.0 to 1.0 NDC space to 0.0 to 1.0 UV space
    v_uv = vec2(x * 0.5 + 0.5, y * 0.5 + 0.5);
    
    gl_Position = vec4(x, y, 0.0, 1.0);
}`,"assets/shaders/vertex/screen-quad.vert":`#version 300 es
out vec2 v_uv;

// Generate a full-screen triangle using the gl_VertexID trick
void main() {
    // Calculate vertices entirely on the GPU
    float x = float((gl_VertexID & 1) << 2) - 1.0;
    float y = float((gl_VertexID & 2) << 1) - 1.0;
    
    // Map the -1.0 to 1.0 NDC space to 0.0 to 1.0 UV space
    v_uv = vec2(x * 0.5 + 0.5, y * 0.5 + 0.5);
    
    gl_Position = vec4(x, y, 0.0, 1.0);
}`,"assets/shaders/vertex/shadow-caster.vert":`#version 300 es
uniform mat4 u_modelMatrix;
in vec4 a_position;

#ifdef SKINNED
// Skinning: 4 joints per vertex; the joint matrices are rows of a float
// texture, 4 texels (columns) per joint, written by SkinnedMeshRendererBehaviour.
in uvec4 a_joints;
in vec4 a_weights;
uniform highp sampler2D u_jointTexture;

mat4 jointMatrix(uint joint) {
  int row = int(joint);
  return mat4(
    texelFetch(u_jointTexture, ivec2(0, row), 0),
    texelFetch(u_jointTexture, ivec2(1, row), 0),
    texelFetch(u_jointTexture, ivec2(2, row), 0),
    texelFetch(u_jointTexture, ivec2(3, row), 0));
}

mat4 skinMatrix() {
  return a_weights.x * jointMatrix(a_joints.x)
       + a_weights.y * jointMatrix(a_joints.y)
       + a_weights.z * jointMatrix(a_joints.z)
       + a_weights.w * jointMatrix(a_joints.w);
}
#endif

void main() {
#ifdef SKINNED
    gl_Position = u_modelMatrix * (skinMatrix() * a_position);
#else
    gl_Position = u_modelMatrix * a_position;
#endif
}
`,"assets/shaders/vertex/skybox.vert":`#version 300 es

precision highp float;

// 1. The shared Camera UBO
layout(std140) uniform CameraBlock {
    mat4 u_viewMatrix;
    mat4 u_projectionMatrix;
};

in vec3 a_position;
out vec3 v_viewDirection;

void main() {
  // 2. STRIP THE TRANSLATION
  // We cast the view matrix down to a mat3 to drop the XYZ position data, 
  // then back to a mat4. This forces the skybox to only rotate, never move.
  mat4 viewRotationOnly = mat4(mat3(u_viewMatrix));

  // 3. Calculate the clip-space position
  vec4 pos = u_projectionMatrix * viewRotationOnly * vec4(a_position, 1.0);

  // 4. THE DEPTH TRICK
  // We set Z equal to W (pos.xyww). When WebGL does the perspective divide (W/W), 
  // the depth becomes exactly 1.0 (the maximum possible depth). 
  // This guarantees the skybox renders behind absolutely everything else.
  gl_Position = pos.xyww;

  // The local vertex position serves as the direction vector for the cubemap
  v_viewDirection = a_position;
}`};var Si=class Si{constructor(r,e){this.gl=r;this.locations=new Map;let i=vt[ne.vertex.fullscreen],n=vt[e];if(!i||!n)throw new Error(`FullscreenProgram: shader not embedded: ${n?ne.vertex.fullscreen:e}`);this.program=Si.link(r,i,n),this.vao=r.createVertexArray()}use(){this.gl.useProgram(this.program)}uniform(r){return this.locations.has(r)||this.locations.set(r,this.gl.getUniformLocation(this.program,r)),this.locations.get(r)}bindTexture(r,e,i){let n=this.gl;n.activeTexture(n.TEXTURE0+i),n.bindTexture(n.TEXTURE_2D,e),n.uniform1i(this.uniform(r),i)}draw(){this.gl.bindVertexArray(this.vao),this.gl.drawArrays(this.gl.TRIANGLES,0,3),this.gl.bindVertexArray(null)}dispose(){this.gl.deleteProgram(this.program),this.gl.deleteVertexArray(this.vao)}static link(r,e,i){let n=u((l,c)=>{let d=r.createShader(l);if(r.shaderSource(d,c),r.compileShader(d),!r.getShaderParameter(d,r.COMPILE_STATUS)){let h=r.getShaderInfoLog(d);throw r.deleteShader(d),new Error(`FullscreenProgram: compile failed: ${h}`)}return d},"compile"),o=r.createProgram(),s=n(r.VERTEX_SHADER,e),a=n(r.FRAGMENT_SHADER,i);if(r.attachShader(o,s),r.attachShader(o,a),r.linkProgram(o),r.deleteShader(s),r.deleteShader(a),!r.getProgramParameter(o,r.LINK_STATUS))throw new Error(`FullscreenProgram: link failed: ${r.getProgramInfoLog(o)}`);return o}};u(Si,"FullscreenProgram");var or=Si;var yo=class yo{constructor(){this.tempVertices=[];this.tempNormals=[];this.tempUVs=[];this.tempFaces=[];this.outputVertices=[];this.outputNormals=[];this.outputUVs=[];this.outputIndices=[]}parse(r){this.resetParser();let e=r.split(`
`);for(let i of e){let n=i.trim();if(n.length===0||n.startsWith("#"))continue;let o=n.split(/\s+/);switch(o[0]){case"v":this.parseVertex(o);break;case"vt":this.parseUV(o);break;case"vn":this.parseNormal(o);break;case"f":this.parseFace(o);break;default:break}}return this.consolidateMeshData(),new K(this.outputVertices,this.outputNormals,this.outputUVs,this.outputIndices)}resetParser(){this.tempVertices=[],this.tempNormals=[],this.tempUVs=[],this.tempFaces=[],this.outputVertices=[],this.outputNormals=[],this.outputUVs=[],this.outputIndices=[]}parseVertex(r){this.tempVertices.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3]))}parseUV(r){this.tempUVs.push(parseFloat(r[1]),parseFloat(r[2]))}parseNormal(r){this.tempNormals.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3]))}parseFace(r){let e={positions:[],uvs:[],normals:[]};for(let i=1;i<r.length;i++){let o=r[i].split("/").map(s=>parseInt(s,10));e.positions.push(o[0]-1),o.length>1&&!isNaN(o[1])?e.uvs.push(o[1]-1):e.uvs.push(-1),o.length>2&&!isNaN(o[2])||o.length===2&&isNaN(o[1])?e.normals.push(o[2]-1):e.normals.push(-1)}if(e.positions.length>=3)for(let i=1;i<e.positions.length-1;i++)this.tempFaces.push({positions:[e.positions[0],e.positions[i],e.positions[i+1]],uvs:e.uvs.includes(-1)?[-1,-1,-1]:[e.uvs[0],e.uvs[i],e.uvs[i+1]],normals:e.normals.includes(-1)?[-1,-1,-1]:[e.normals[0],e.normals[i],e.normals[i+1]]})}consolidateMeshData(){let r=new Map,e=0;for(let i of this.tempFaces)for(let n=0;n<3;n++){let o=i.positions[n],s=i.uvs[n],a=i.normals[n],l=`${o}/${s}/${a}`;r.has(l)||(r.set(l,e),this.outputVertices.push(x.fromValues(this.tempVertices[o*3+0],this.tempVertices[o*3+1],this.tempVertices[o*3+2])),s!==-1?this.outputUVs.push(ce.fromValues(this.tempUVs[s*2+0],this.tempUVs[s*2+1])):this.outputUVs.push(ce.fromValues(0,0)),a!==-1?this.outputNormals.push(x.fromValues(this.tempNormals[a*3+0],this.tempNormals[a*3+1],this.tempNormals[a*3+2])):this.outputNormals.push(x.fromValues(0,0,0)),e++),this.outputIndices.push(r.get(l))}}};u(yo,"ObjParser");var Ei=yo;var te=(r=>(r[r.TEXTURE_2D=WebGL2RenderingContext.TEXTURE_2D]="TEXTURE_2D",r))(te||{}),it=(s=>(s[s.NEAREST=WebGL2RenderingContext.NEAREST]="NEAREST",s[s.LINEAR=WebGL2RenderingContext.LINEAR]="LINEAR",s[s.NEAREST_MIPMAP_NEAREST=WebGL2RenderingContext.NEAREST_MIPMAP_NEAREST]="NEAREST_MIPMAP_NEAREST",s[s.LINEAR_MIPMAP_NEAREST=WebGL2RenderingContext.LINEAR_MIPMAP_NEAREST]="LINEAR_MIPMAP_NEAREST",s[s.NEAREST_MIPMAP_LINEAR=WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR]="NEAREST_MIPMAP_LINEAR",s[s.LINEAR_MIPMAP_LINEAR=WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR]="LINEAR_MIPMAP_LINEAR",s))(it||{}),Dt=(i=>(i[i.REPEAT=WebGL2RenderingContext.REPEAT]="REPEAT",i[i.MIRRORED_REPEAT=WebGL2RenderingContext.MIRRORED_REPEAT]="MIRRORED_REPEAT",i[i.CLAMP_TO_EDGE=WebGL2RenderingContext.CLAMP_TO_EDGE]="CLAMP_TO_EDGE",i))(Dt||{}),Te=(n=>(n[n.MIN_FILTER=WebGL2RenderingContext.TEXTURE_MIN_FILTER]="MIN_FILTER",n[n.MAG_FILTER=WebGL2RenderingContext.TEXTURE_MAG_FILTER]="MAG_FILTER",n[n.WRAP_S=WebGL2RenderingContext.TEXTURE_WRAP_S]="WRAP_S",n[n.WRAP_T=WebGL2RenderingContext.TEXTURE_WRAP_T]="WRAP_T",n))(Te||{}),Bt=class Bt extends q{constructor(e,i){super("Texture");this.gl=e;this.textureUri=i;this.image=null;this._glTexture=null;this.isLoaded=!1;this.isLoading=!1;this.minFilter=it.LINEAR_MIPMAP_LINEAR;this.magFilter=it.LINEAR;this.wrapS=Dt.MIRRORED_REPEAT;this.wrapT=Dt.MIRRORED_REPEAT;this._isBound=!1;this._width=0;this._height=0;this._loadPromise=null}setGL(e){this.gl=e}static createDepthTexture(e,i,n){let o=e.createTexture();if(!o)return console.error("Failed to create WebGL depth texture."),new Bt(e);e.bindTexture(te.TEXTURE_2D,o),e.texImage2D(te.TEXTURE_2D,0,e.DEPTH_COMPONENT32F,i,n,0,e.DEPTH_COMPONENT,e.FLOAT,null),e.texParameteri(te.TEXTURE_2D,Te.MIN_FILTER,it.NEAREST),e.texParameteri(te.TEXTURE_2D,Te.MAG_FILTER,it.NEAREST),e.texParameteri(te.TEXTURE_2D,Te.WRAP_S,Dt.CLAMP_TO_EDGE),e.texParameteri(te.TEXTURE_2D,Te.WRAP_T,Dt.CLAMP_TO_EDGE),e.bindTexture(te.TEXTURE_2D,null);let s=new Bt(e);return s._glTexture=o,s.isLoaded=!0,s._width=i,s._height=n,s}static create(e,i,n,o=null){let s=e.createTexture();if(!s)return console.error("Failed to create WebGL texture."),new Bt(e);e.bindTexture(te.TEXTURE_2D,s),o===null?(e.texImage2D(te.TEXTURE_2D,0,e.RGBA8,i,n,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(te.TEXTURE_2D,Te.MIN_FILTER,it.NEAREST),e.texParameteri(te.TEXTURE_2D,Te.MAG_FILTER,it.NEAREST)):(e.texImage2D(te.TEXTURE_2D,0,e.RGBA,i,n,0,e.RGBA,e.UNSIGNED_BYTE,o),e.texParameteri(te.TEXTURE_2D,Te.MIN_FILTER,it.LINEAR_MIPMAP_LINEAR),e.texParameteri(te.TEXTURE_2D,Te.MAG_FILTER,it.LINEAR),e.generateMipmap(te.TEXTURE_2D)),e.texParameteri(te.TEXTURE_2D,Te.WRAP_S,Dt.CLAMP_TO_EDGE),e.texParameteri(te.TEXTURE_2D,Te.WRAP_T,Dt.CLAMP_TO_EDGE),e.bindTexture(te.TEXTURE_2D,null);let a=new Bt(e);return a._glTexture=s,a.isLoaded=!0,a._width=i,a._height=n,a}load(){if(this._loadPromise)return this._loadPromise;if(this.isLoaded)return Promise.resolve();if(!this.gl)return Promise.reject(new Error("WebGL context not available."));if(!this.textureUri)return Promise.reject(new Error("Failed to load image. Please provide a texture URL!"));let e=this.textureUri,i=this.loader??W.defaultLoader;return this.isLoading=!0,this._loadPromise=i.loadImage(e).then(n=>{if(this.isLoading=!1,!this.gl)throw new Error("WebGL context is null after loading.");this.image=n,this.isLoaded=!0,this._width=n.width,this._height=n.height,this.createGLTexture(this.gl)},n=>{throw this.isLoading=!1,this.isLoaded=!1,this.image=null,this._loadPromise=null,new Error(`Failed to load image: ${e}. Error: ${n}`)}),this._loadPromise}createGLTexture(e){if(!this.isLoaded||!this.image){console.warn("Image not loaded or image data is missing. Cannot create WebGL texture.");return}this._glTexture=e.createTexture(),this.bind(),e.texImage2D(te.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,this.image),this.setTextureParameters(),this.unBind()}rebuild(){if(!this.gl||!this.isLoaded||!this.image){console.warn("Cannot rebuild texture. Either WebGL context, image, or loading status is invalid.");return}this.bind(),this.gl.texImage2D(te.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,this.image),this.setTextureParameters(),this.unBind()}setTextureParameters(){this.gl&&(this.bind(),this.gl.texParameteri(te.TEXTURE_2D,Te.MIN_FILTER,this.minFilter),this.gl.texParameteri(te.TEXTURE_2D,Te.MAG_FILTER,this.magFilter),this.gl.texParameteri(te.TEXTURE_2D,Te.WRAP_S,this.wrapS),this.gl.texParameteri(te.TEXTURE_2D,Te.WRAP_T,this.wrapT),this.gl.generateMipmap(te.TEXTURE_2D),this.unBind())}setMinFilter(e){this.minFilter=e,this.setTextureParameters()}setMagFilter(e){this.magFilter=e,this.setTextureParameters()}setWrapS(e){this.wrapS=e,this.setTextureParameters()}setWrapT(e){this.wrapT=e,this.setTextureParameters()}setPixels(e,i,n,o,s){if(!this.gl||!this._glTexture){console.warn("Cannot set pixels. WebGL context or texture is not available.");return}this.bind(),s instanceof HTMLImageElement||s instanceof HTMLCanvasElement||s instanceof HTMLVideoElement?this.gl.texSubImage2D(this.gl.TEXTURE_2D,0,e,i,this.gl.RGBA,this.gl.UNSIGNED_BYTE,s):this.gl.texSubImage2D(this.gl.TEXTURE_2D,0,e,i,n,o,this.gl.RGBA,this.gl.UNSIGNED_BYTE,s),this.unBind()}getPixels(e,i){if(!this.gl||!this._glTexture)return console.warn("Cannot get pixels. WebGL context or texture is not available."),null;let n=this.gl.createFramebuffer();this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,n),this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,this.gl.COLOR_ATTACHMENT0,te.TEXTURE_2D,this._glTexture,0);let o=new Uint8Array(e*i*4);return this.gl.readPixels(0,0,e,i,this.gl.RGBA,this.gl.UNSIGNED_BYTE,o),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.deleteFramebuffer(n),o}bind(){this.gl&&(this.gl.bindTexture(te.TEXTURE_2D,this._glTexture),this._isBound=!0)}unBind(){!this.gl||!this._isBound||(this.gl.bindTexture(te.TEXTURE_2D,null),this._isBound=!1)}get glTexture(){return this._glTexture}get isImageLoaded(){return this.isLoaded}get width(){return this._width}get height(){return this._height}destroy(){if(this.gl&&this._glTexture){let e=this._glTexture;this._glTexture=null,this.gl.deleteTexture(e),W.forgetTexture(this)}this.image=null,this.isLoaded=!1}toJsonObject(){return{...super.toJsonObject(),url:this.textureUri,minFilter:this.minFilter,magFilter:this.magFilter,wrapS:this.wrapS,wrapT:this.wrapT}}fromJson(e){super.fromJson(e),this.textureUri=e.url,e.minFilter&&(this.minFilter=e.minFilter),e.magFilter&&(this.magFilter=e.magFilter),e.wrapS&&(this.wrapS=e.wrapS),e.wrapT&&(this.wrapT=e.wrapT),this.isImageLoaded&&this.setTextureParameters()}};u(Bt,"Texture");var qe=Bt;var Ai=class Ai extends qe{constructor(e,i){super(e);this.gl=e;this.textureUris=i;this._className="CubemapTexture";this.isWhiteCubemap=!1;this.imagesData=[];this.loadedImages=[null,null,null,null,null,null]}static createWhiteCubemap(e){let i=new Ai(e);return i.isWhiteCubemap=!0,i.generateWhiteCubemap(e),i.isLoaded=!0,i}generateWhiteCubemap(e){if(this._glTexture=e.createTexture(),!this._glTexture){console.error("Failed to create WebGL texture for white cubemap.");return}e.bindTexture(e.TEXTURE_CUBE_MAP,this._glTexture);let i=new Uint8Array([255,255,255,255]),n=[e.TEXTURE_CUBE_MAP_POSITIVE_X,e.TEXTURE_CUBE_MAP_NEGATIVE_X,e.TEXTURE_CUBE_MAP_POSITIVE_Y,e.TEXTURE_CUBE_MAP_NEGATIVE_Y,e.TEXTURE_CUBE_MAP_POSITIVE_Z,e.TEXTURE_CUBE_MAP_NEGATIVE_Z];for(let o of n)e.texImage2D(o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,i);this.minFilter=e.NEAREST,this.magFilter=e.NEAREST,this.wrapS=e.CLAMP_TO_EDGE,this.wrapT=e.CLAMP_TO_EDGE,e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MIN_FILTER,this.minFilter),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAG_FILTER,this.magFilter),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_S,this.wrapS),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_T,this.wrapT),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_R,this.wrapT),e.bindTexture(e.TEXTURE_CUBE_MAP,null),this._width=1,this._height=1}async load(){if(!(this.isLoading||this.isImageLoaded))return this.isLoading=!0,new Promise((e,i)=>{if(this.isWhiteCubemap){this.gl?(this.generateWhiteCubemap(this.gl),this.isLoaded=!0,this.isLoading=!1,e()):i(new Error("GL context missing for white cubemap."));return}if(!this.textureUris||this.textureUris.length!==6){i(new Error("Cubemap requires exactly six texture URIs."));return}for(let n=0;n<this.textureUris.length;n++){this.loadedImages[n]=null;let o=new Image;o.onload=()=>{this.setLoadedImage(n,!0),this.allImagesFetchedAndLoaded()&&e()},o.onerror=s=>{this.setLoadedImage(n,!1),i(new Error(`Failed to load image: ${this.textureUris[n]}. Error: ${s}`))},W.resolveUri(this.textureUris[n]).then(s=>{o.src=s},s=>i(new Error(`Failed to resolve ${this.textureUris[n]}: ${s}`))),this.imagesData[n]=o}})}allImagesFetchedAndLoaded(){return this.loadedImages.filter(e=>e===!0).length===this.textureUris?.length}allImagesFetched(){return this.loadedImages.filter(e=>e==null).length===0}setLoadedImage(e,i){this.loadedImages[e]=i,this.allImagesFetchedAndLoaded()&&!this.isImageLoaded&&this.gl?(this.createGLTexture(this.gl),this.isLoaded=!0,this.isLoading=!1):this.allImagesFetched()&&!this.allImagesFetchedAndLoaded()&&console.error("Was not possible to get all images!")}bind(){this.gl&&this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP,this._glTexture)}createGLTexture(e){if(this._glTexture=e.createTexture(),!this._glTexture){console.error("Failed to create WebGL texture for cubemap.");return}this.bind(),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MIN_FILTER,this.minFilter),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAG_FILTER,this.magFilter),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_S,this.wrapS),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_T,this.wrapT),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_R,this.wrapT);let i=[{target:e.TEXTURE_CUBE_MAP_POSITIVE_X,image:this.imagesData[0]},{target:e.TEXTURE_CUBE_MAP_NEGATIVE_X,image:this.imagesData[1]},{target:e.TEXTURE_CUBE_MAP_POSITIVE_Y,image:this.imagesData[2]},{target:e.TEXTURE_CUBE_MAP_NEGATIVE_Y,image:this.imagesData[3]},{target:e.TEXTURE_CUBE_MAP_POSITIVE_Z,image:this.imagesData[4]},{target:e.TEXTURE_CUBE_MAP_NEGATIVE_Z,image:this.imagesData[5]}],n=0,o=e.RGBA,s=e.RGBA,a=e.UNSIGNED_BYTE;i.forEach(l=>{e.texImage2D(l.target,n,o,s,a,l.image)}),e.generateMipmap(e.TEXTURE_CUBE_MAP),this.unBind()}setTextureUris(e){e?.length!==6&&console.error(`Incorrect number of uris: 6 were expected but ${e.length} were given!`),this.textureUris=e}toJsonObject(){return{...super.toJsonObject(),uris:this.textureUris,isWhiteCubemap:this.isWhiteCubemap}}fromJson(e){super.fromJson(e),this.textureUris=e.uris,this.isWhiteCubemap=e.isWhiteCubemap??!1,this.isLoaded=!1,this.isLoading=!1,this.loadedImages=[null,null,null,null,null,null],this.imagesData=[]}};u(Ai,"CubemapTexture");var sr=Ai;var Ri=class Ri{constructor(r,e,i,n={}){this.gl=r;this._framebuffer=null;this._colorTexture=null;this._depthTexture=null;this._depthRenderbuffer=null;this._width=0;this._height=0;if(this.color=n.color===void 0?"rgba8":n.color,this.depth=n.depth===void 0?"texture":n.depth,this.color==="rgba16f"&&!Ri.supportsFloatColor(r))throw new Error("RenderTarget: rgba16f needs EXT_color_buffer_float.");this.resize(e,i)}static supportsFloatColor(r){return!!r.getExtension("EXT_color_buffer_float")}get width(){return this._width}get height(){return this._height}get framebuffer(){return this._framebuffer}get colorTexture(){return this._colorTexture}get depthTexture(){return this._depthTexture}resize(r,e){if(r=Math.max(1,Math.floor(r)),e=Math.max(1,Math.floor(e)),this._framebuffer&&r===this._width&&e===this._height)return;this.dispose();let i=this.gl;if(this._width=r,this._height=e,this._framebuffer=i.createFramebuffer(),i.bindFramebuffer(i.FRAMEBUFFER,this._framebuffer),this.color){let o=this.color==="rgba16f"?i.RGBA16F:i.RGBA8,s=this.color==="rgba16f"?i.HALF_FLOAT:i.UNSIGNED_BYTE;this._colorTexture=this.createTexture(o,i.RGBA,s,i.LINEAR),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this._colorTexture,0)}else i.drawBuffers([i.NONE]),i.readBuffer(i.NONE);this.depth==="texture"?(this._depthTexture=this.createTexture(i.DEPTH_COMPONENT24,i.DEPTH_COMPONENT,i.UNSIGNED_INT,i.NEAREST),i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,this._depthTexture,0)):this.depth==="renderbuffer"&&(this._depthRenderbuffer=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,this._depthRenderbuffer),i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_COMPONENT24,r,e),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,this._depthRenderbuffer),i.bindRenderbuffer(i.RENDERBUFFER,null));let n=i.checkFramebufferStatus(i.FRAMEBUFFER);if(i.bindFramebuffer(i.FRAMEBUFFER,null),n!==i.FRAMEBUFFER_COMPLETE)throw new Error(`RenderTarget: framebuffer incomplete (0x${n.toString(16)}).`)}bind(){this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this._framebuffer),this.gl.viewport(0,0,this._width,this._height)}clear(r){let e=this.gl,i=0;this.color&&r&&(e.clearColor(r[0],r[1],r[2],r[3]),i|=e.COLOR_BUFFER_BIT),this.depth&&(e.depthMask(!0),i|=e.DEPTH_BUFFER_BIT),i&&e.clear(i)}dispose(){let r=this.gl;this._framebuffer&&r.deleteFramebuffer(this._framebuffer),this._colorTexture&&r.deleteTexture(this._colorTexture),this._depthTexture&&r.deleteTexture(this._depthTexture),this._depthRenderbuffer&&r.deleteRenderbuffer(this._depthRenderbuffer),this._framebuffer=this._colorTexture=this._depthTexture=this._depthRenderbuffer=null}createTexture(r,e,i,n){let o=this.gl,s=o.createTexture();return o.bindTexture(o.TEXTURE_2D,s),o.texImage2D(o.TEXTURE_2D,0,r,this._width,this._height,0,e,i,null),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,n),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,n),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindTexture(o.TEXTURE_2D,null),s}};u(Ri,"RenderTarget");var Ye=Ri;var _o="rendertexture://";function wo(t){return!!t&&t.startsWith(_o)}u(wo,"isRenderTextureUri");function To(t){return wo(t)?t:_o+t}u(To,"renderTextureUri");var Mo=class Mo extends qe{constructor(e,i){super(e,To(i));this.targets=[null,null];this.readIndex=0;this.written=!1;this.isLoaded=!0,this.name=this.textureName}get textureName(){return this.textureUri.slice(_o.length)}get glTexture(){return this.written?this.targets[this.readIndex]?.colorTexture??null:null}beginWrite(e,i){let n=1-this.readIndex,o=this.targets[n];return o||(o=this.targets[n]=new Ye(this.gl,e,i,{color:"rgba8",depth:null})),o.resize(e,i),this._width=o.width,this._height=o.height,o}endWrite(){this.readIndex=1-this.readIndex,this.written=!0}load(){return Promise.resolve()}setTextureParameters(){}bind(){this.gl?.bindTexture(this.gl.TEXTURE_2D,this.glTexture),this._isBound=!0}destroy(){for(let e of this.targets)e?.dispose();this.targets[0]=this.targets[1]=null,this.written=!1}};u(Mo,"RenderTexture");var Ir=Mo;var So=class So{constructor(r){this.options=r;this.entries=new Map}async acquire(r){let e=this.entries.get(r);e||(e=this.startLoad(r)),e.refs++;try{let i=await e.promise;return this.createHandle(r,e,i)}catch(i){throw e.refs--,i}}peek(r){let e=this.entries.get(r);return e?.loaded?e.value:void 0}has(r){return this.entries.has(r)}remove(r,e){let i=this.entries.get(r);return!i||e!==void 0&&i.value!==e?!1:(this.entries.delete(r),!0)}trim(){let r=0;for(let[e,i]of this.entries)i.loaded&&i.refs===0&&(this.entries.delete(e),this.disposeValue(i.value),r++);return r}clear(){let r=[...this.entries.values()];this.entries.clear();for(let e of r)e.loaded&&this.disposeValue(e.value)}stats(){let r=0,e=0,i=0;for(let n of this.entries.values())n.loaded?n.refs===0&&e++:r++,i+=n.refs;return{entries:this.entries.size-r,loading:r,unused:e,references:i}}startLoad(r){let e={refs:0,loaded:!1,promise:void 0};return e.promise=this.options.load(r).then(i=>(this.entries.get(r)===e?(e.value=i,e.loaded=!0):this.disposeValue(i),i),i=>{throw this.entries.get(r)===e&&this.entries.delete(r),i}),this.entries.set(r,e),e}createHandle(r,e,i){let n=!1;return{key:r,value:i,release:u(()=>{n||(n=!0,this.entries.get(r)===e&&e.refs>0&&e.refs--)},"release")}}disposeValue(r){try{this.options.dispose?.(r)}catch(e){console.error("[ResourceCache] dispose failed",e)}}};u(So,"ResourceCache");var gt=So;var Eo=class Eo{constructor(r){this.resolve=r}async loadText(r){let e=await fetch(await this.resolve(r));if(!e.ok)throw new Error(`Failed to load ${r} (HTTP ${e.status})`);return e.text()}async loadBinary(r){let e=await fetch(await this.resolve(r));if(!e.ok)throw new Error(`Failed to load ${r} (HTTP ${e.status})`);return e.arrayBuffer()}async loadImage(r){let e=await this.resolve(r);return new Promise((i,n)=>{let o=new Image;o.onload=()=>i(o),o.onerror=()=>n(new Error(`Failed to load image: ${r}`)),o.src=e})}};u(Eo,"DefaultResourceLoader");var nt=Eo;var Vh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4////fwAJ+wP99djxmgAAAABJRU5ErkJggg==",Wh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYGD4DwABBAEAgLvRWwAAAABJRU5ErkJggg==",Hh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNoaPj/HwAGggL/bOBDIwAAAABJRU5ErkJggg==",Jh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4z/D/PwAG/gL+0yubzgAAAABJRU5ErkJggg==",Me={white:"builtin://white",black:"builtin://black",normal:"builtin://normal",missing:"builtin://missing"},qh={[Me.white]:Vh,[Me.black]:Wh,[Me.normal]:Hh,[Me.missing]:Jh};function ar(t){return qh[t]}u(ar,"builtinTextureUrl");var Ao=class Ao extends K{constructor(){super(...arguments);this.joints=new Uint16Array(0);this.weights=new Float32Array(0)}};u(Ao,"SkinnedMeshData");var ot=Ao;function bt(t){let r=t.indexOf("#");if(r<0)return null;let e=/^(mesh|skin|anim|image)\/(\d+)$/.exec(t.slice(r+1));return e?{modelUri:t.slice(0,r),kind:e[1],index:Number(e[2])}:null}u(bt,"parseModelPartUri");var Ci=class Ci{constructor(r,e,i=Ci.durationOf(e)){this.name=r;this.channels=e;this.duration=i}static durationOf(r){let e=0;for(let i of r)i.times.length&&(e=Math.max(e,i.times[i.times.length-1]));return e}};u(Ci,"AnimationClip");var xt=Ci;function Yh(t){return t==="rotation"?4:3}u(Yh,"componentCount");function $h(t,r,e=0){let i=t.length;if(i<2||r<=t[0])return 0;if(r>=t[i-1])return i-1;if(e>=0&&e<i-1&&t[e]<=r&&r<t[e+1])return e;if(e+1<i-1&&t[e+1]<=r&&r<t[e+2])return e+1;let n=0,o=i-1;for(;o-n>1;){let s=n+o>>1;t[s]<=r?n=s:o=s}return n}u($h,"findKey");var It=X.create(),Pa=X.create();function Ro(t,r,e,i=0){let{times:n,values:o,interpolation:s}=t,a=Yh(t.property),l=s==="CUBICSPLINE",c=l?a*3:a,d=l?a:0,h=$h(n,r,i),m=n.length-1;if(s==="STEP"||h>=m||r<=n[0]){for(let _=0;_<a;_++)e[_]=o[h*c+d+_];return h}let p=n[h],f=n[h+1]-p,g=f>0?(r-p)/f:0;if(l){let _=g*g,w=_*g,S=2*w-3*_+1,M=w-2*_+g,L=-2*w+3*_,k=w-_,I=h*c,D=(h+1)*c;for(let O=0;O<a;O++){let Y=o[I+a+O],J=o[I+2*a+O]*f,N=o[D+a+O],we=o[D+O]*f;e[O]=S*Y+M*J+L*N+k*we}return a===4&&jh(e),h}let b=h*a,T=(h+1)*a;if(a===4)X.set(It,o[b],o[b+1],o[b+2],o[b+3]),X.set(Pa,o[T],o[T+1],o[T+2],o[T+3]),X.slerp(It,It,Pa,g),e[0]=It[0],e[1]=It[1],e[2]=It[2],e[3]=It[3];else for(let _=0;_<a;_++)e[_]=o[b+_]+(o[T+_]-o[b+_])*g;return h}u(Ro,"sampleChannel");function jh(t){let r=Math.hypot(t[0],t[1],t[2],t[3])||1;t[0]/=r,t[1]/=r,t[2]/=r,t[3]/=r}u(jh,"normalize4");var Da="Kaydara FBX Binary  ";function Co(t){return t.byteLength<27||new TextDecoder("ascii").decode(new Uint8Array(t,0,Da.length))!==Da?null:new DataView(t).getUint32(23,!0)}u(Co,"fbxVersion");function Ba(t){return Co(t)!==null||Ia(t)}u(Ba,"isFbx");function Ia(t){let r=new TextDecoder("utf-8").decode(new Uint8Array(t,0,Math.min(t.byteLength,1024)));return/^\s*;\s*FBX\s/.test(r)||r.includes("FBXHeaderExtension:")}u(Ia,"isAsciiFbx");async function ka(t){if(Co(t)===null&&Ia(t))return Zh(new TextDecoder("utf-8").decode(t));let r=Co(t);if(r===null)throw new Error("Not an FBX file.");if(r<7e3)throw new Error(`FBX ${r/1e3} is not supported: export as FBX 7.x binary (Mixamo: "FBX Binary").`);let e=new Lo(t,r>=7500),i=e.readNodes(27,t.byteLength);return await Promise.all(e.pending.map(Kh)),{version:r,nodes:i}}u(ka,"readFbx");var Po=class Po{constructor(r,e){this.wide=e;this.text=new TextDecoder("utf-8");this.pending=[];this.view=new DataView(r),this.bytes=new Uint8Array(r)}readNodes(r,e){let i=[],n=r,o=this.wide?25:13;for(;n+o<=e;){let s=this.wide?Number(this.view.getBigUint64(n,!0)):this.view.getUint32(n,!0),a=this.wide?Number(this.view.getBigUint64(n+8,!0)):this.view.getUint32(n+4,!0),l=this.wide?Number(this.view.getBigUint64(n+16,!0)):this.view.getUint32(n+8,!0),c=this.bytes[n+o-1];if(s===0)break;let d=n+o,h=this.text.decode(this.bytes.subarray(d,d+c)),m=d+c,p=this.readProps(m,a),v=m+l,f=v<s?this.readNodes(v,s):[];i.push({name:h,props:p,children:f}),n=s}return i}readProps(r,e){let i=[],n=this.view,o=r;for(let s=0;s<e;s++){let a=String.fromCharCode(this.bytes[o++]);switch(a){case"Y":i.push(n.getInt16(o,!0)),o+=2;break;case"C":i.push(this.bytes[o]!==0),o+=1;break;case"I":i.push(n.getInt32(o,!0)),o+=4;break;case"F":i.push(n.getFloat32(o,!0)),o+=4;break;case"D":i.push(n.getFloat64(o,!0)),o+=8;break;case"L":i.push(Number(n.getBigInt64(o,!0))),o+=8;break;case"S":case"R":{let l=n.getUint32(o,!0),c=this.bytes.subarray(o+4,o+4+l);i.push(a==="S"?this.text.decode(c):c.slice()),o+=4+l;break}case"f":case"d":case"l":case"i":case"b":{let l=n.getUint32(o,!0),c=n.getUint32(o+4,!0),d=n.getUint32(o+8,!0),h=this.bytes.subarray(o+12,o+12+d);o+=12+d,c===1?(i.push(new Uint8Array(0)),this.pending.push({props:i,index:i.length-1,type:a,length:l,bytes:h.slice()})):i.push(Fa(a,h.slice(),l));break}default:throw new Error(`Unknown FBX property type '${a}' at byte ${o-1}.`)}}return i}};u(Po,"Reader");var Lo=Po;async function Kh(t){let r=new Blob([t.bytes]).stream().pipeThrough(new DecompressionStream("deflate")),e=new Uint8Array(await new Response(r).arrayBuffer());t.props[t.index]=Fa(t.type,e,t.length)}u(Kh,"inflateInto");function Fa(t,r,e){let i=new DataView(r.buffer,r.byteOffset,r.byteLength);switch(t){case"f":{let n=new Float32Array(e);for(let o=0;o<e;o++)n[o]=i.getFloat32(o*4,!0);return n}case"d":{let n=new Float64Array(e);for(let o=0;o<e;o++)n[o]=i.getFloat64(o*8,!0);return n}case"i":{let n=new Int32Array(e);for(let o=0;o<e;o++)n[o]=i.getInt32(o*4,!0);return n}case"l":{let n=new Float64Array(e);for(let o=0;o<e;o++)n[o]=Number(i.getBigInt64(o*8,!0));return n}case"b":{let n=[];for(let o=0;o<e;o++)n.push(r[o]!==0);return n}}throw new Error(`Unknown FBX array type '${t}'.`)}u(Fa,"decodeArray");function kr(t,r){return t?.children.find(e=>e.name===r)}u(kr,"fbxChild");function ve(t,r){return kr(t,r)?.props[0]}u(ve,"fbxValue");var Qh=/(Index|Indexes|Indices)$/;function Zh(t){let r=new Xo(t),e=Na(r,!1),i=e.find(o=>o.name==="FBXHeaderExtension"),n=Number(ve(i,"FBXVersion")??7e3);if(n<7e3)throw new Error(`FBX ${n/1e3} is not supported: export as FBX 7.x (Mixamo: "FBX Binary").`);return{version:n,nodes:e}}u(Zh,"readAsciiFbx");var Do=class Do{constructor(r){this.s=r;this.i=0;this.peeked=null}peek(){return this.peeked||(this.peeked=this.read()),this.peeked}next(){let r=this.peek();return this.peeked=null,r}read(){let r=this.s;for(;;){for(;this.i<r.length&&r.charCodeAt(this.i)<=32;)this.i++;if(this.i>=r.length)return null;if(r[this.i]!==";")break;for(;this.i<r.length&&r[this.i]!==`
`;)this.i++}let e=r[this.i];if(e==="{"||e==="}"||e===",")return this.i++,{kind:e,value:e};if(e==='"'){let o=r.indexOf('"',this.i+1),s=r.slice(this.i+1,o<0?r.length:o).replace(/&quot;/g,'"');return this.i=o<0?r.length:o+1,{kind:"string",value:s}}if(e==="*"){let o=this.i+1;for(;o<r.length&&/[0-9]/.test(r[o]);)o++;let s=r.slice(this.i+1,o);return this.i=o,{kind:"count",value:s}}let i=this.i;for(;i<r.length&&/[^\s,{}":;]/.test(r[i]);)i++;i===this.i&&i++;let n=r.slice(this.i,i);return this.i=i,r[i]===":"?(this.i++,{kind:"key",value:n}):{kind:/^[-+]?(\d|\.\d)/.test(n)?"number":"word",value:n}}};u(Do,"AsciiTokens");var Xo=Do;function Na(t,r){let e=[];for(;;){let i=t.peek();if(!i)break;if(i.kind==="}"){r&&t.next();break}t.next(),i.kind==="key"&&e.push(em(i.value,t))}return e}u(Na,"parseAsciiNodes");function em(t,r){let e=[],i=[],n=!0;for(;;){let o=r.peek();if(!o||o.kind==="key"||o.kind==="}")break;if(o.kind===","){r.next(),n=!0;continue}if(o.kind==="{"){r.next(),i=Na(r,!0);break}if(!n)break;if(r.next(),n=!1,o.kind==="count"){e.push(tm(t,Number(o.value),r));break}e.push(o.kind==="number"?Number(o.value):o.value)}if(t==="Content"){let o=e.filter(l=>typeof l=="string"&&l.length>0).map(rm),s=new Uint8Array(o.reduce((l,c)=>l+c.length,0)),a=0;for(let l of o)s.set(l,a),a+=l.length;return{name:t,props:s.length?[s]:[],children:i}}return{name:t,props:e,children:i}}u(em,"parseAsciiNode");function tm(t,r,e){let i=Qh.test(t)?new Int32Array(r):new Float64Array(r);if(e.peek()?.kind!=="{")return i;e.next();let n=0;for(;;){let o=e.next();if(!o||o.kind==="}")break;o.kind==="number"&&n<r&&(i[n++]=Number(o.value))}return i}u(tm,"parseAsciiArray");function rm(t){let r=atob(t.replace(/[^A-Za-z0-9+/=]/g,"")),e=new Uint8Array(r.length);for(let i=0;i<r.length;i++)e[i]=r.charCodeAt(i);return e}u(rm,"decodeBase64");var Ua=46186158e3;async function Ga(t,r={}){let{nodes:e}=await ka(t);return new Bo(e,r.fps??30).convert()}u(Ga,"parseFbx");var Io=class Io{constructor(r,e){this.root=r;this.fps=e;this.objects=new Map;this.connections=[];this.nodeIndexById=new Map;this.model={nodes:[],meshes:[],skins:[],clips:[],materials:[],images:[],unitScale:.01};this.imageIndexById=new Map;this.materialIndexById=new Map}convert(){this.readSettings();for(let r of this.root.find(e=>e.name==="Objects")?.children??[]){let[e,i,n]=r.props;this.objects.set(e,{id:e,name:Va(i),kind:r.name,type:n??"",node:r})}for(let r of this.root.find(e=>e.name==="Connections")?.children??[]){let[e,i,n,o]=r.props;this.connections.push({type:e,child:i,parent:n,property:o})}return this.readNodes(),this.readMeshes(),this.readAnimations(),this.model}readSettings(){let r=Nr(this.root.find(n=>n.name==="GlobalSettings")),e=r.get("UnitScaleFactor")?.[0];typeof e=="number"&&e>0&&(this.model.unitScale=e/100);let i=r.get("UpAxis")?.[0];typeof i=="number"&&i!==1&&console.warn(`FBX: up axis ${"XYZ"[i]} is not converted; the model may lie on its side.`)}readNodes(){let r=[...this.objects.values()].filter(o=>o.kind==="Model"),e=new Set(r.map(o=>o.id)),i=new Map;for(let o of this.connections)o.type==="OO"&&e.has(o.child)&&e.has(o.parent)&&i.set(o.child,o.parent);let n=u(o=>{if(this.nodeIndexById.has(o.id))return;let s=i.get(o.id);s!==void 0&&n(this.objects.get(s));let a=s!==void 0?this.nodeIndexById.get(s):-1;this.nodeIndexById.set(o.id,this.model.nodes.length),this.model.nodes.push({name:o.name,parent:a,...nm(o.node)})},"visit");r.forEach(n)}readMeshes(){for(let r of this.objects.values()){if(r.kind!=="Model"||r.type!=="Mesh")continue;let e=this.childrenOf(r.id).find(l=>l.kind==="Geometry");if(!e)continue;let i=this.model.nodes[this.nodeIndexById.get(r.id)],n=this.childrenOf(e.id).find(l=>l.kind==="Deformer"&&l.type==="Skin"),o=n?this.childrenOf(n.id).filter(l=>l.kind==="Deformer"&&l.type==="Cluster"):[],s=im(e.node,o.map(l=>l.node));if(i.mesh=this.model.meshes.length,this.model.meshes.push(s),o.length){let l={joints:[],inverseBindMatrices:[]},c=this.bindPose().get(r.id)??this.globalMatrix(this.nodeIndexById.get(r.id));for(let d of o){let h=this.childrenOf(d.id).find(v=>v.kind==="Model");l.joints.push(h?this.nodeIndexById.get(h.id):0);let m=za(ve(d.node,"TransformLink")),p=E.invert(E.create(),m)??E.create();l.inverseBindMatrices.push(E.multiply(p,p,c))}i.skin=this.model.skins.length,this.model.skins.push(l)}let a=this.childrenOf(r.id).find(l=>l.kind==="Material");a&&(i.material=this.readMaterial(a))}}readMaterial(r){let e=this.materialIndexById.get(r.id);if(e!==void 0)return e;let i=Nr(r.node),n=i.get("DiffuseColor")??i.get("Diffuse")??[.8,.8,.8],o={name:r.name,color:[n[0],n[1],n[2],1]};for(let s of this.connections){if(s.type!=="OP"||s.parent!==r.id)continue;let a=this.objects.get(s.child);if(a?.kind!=="Texture")continue;let l=this.readTextureImage(a);if(l===void 0)continue;let c=s.property??"";/^Diffuse/.test(c)?o.albedo=l:/Normal|Bump/.test(c)?o.normal=l:/^Specular|Reflection/.test(c)?o.specular=l:/^Emissive|Glow/.test(c)&&(o.emissive=l)}return o.albedo!==void 0&&(o.color=[1,1,1,1]),this.materialIndexById.set(r.id,this.model.materials.length),this.model.materials.push(o),this.model.materials.length-1}readTextureImage(r){let e=this.childrenOf(r.id).find(l=>l.kind==="Video");if(!e)return;let i=this.imageIndexById.get(e.id);if(i!==void 0)return i;let n=ve(e.node,"Content");if(!(n instanceof Uint8Array)||n.length===0)return;let o=String(ve(e.node,"RelativeFilename")??ve(e.node,"Filename")??e.name),s=o.split(/[\\/]/).pop()??o,a={name:s,mimeType:am(n,s),data:n};return this.imageIndexById.set(e.id,this.model.images.length),this.model.images.push(a),this.model.images.length-1}readAnimations(){for(let r of this.objects.values()){if(r.kind!=="AnimationStack")continue;let e=this.readStack(r);e&&this.model.clips.push(e)}}readStack(r){let e=new Map,i=1/0,n=-1/0;for(let c of this.childrenOf(r.id).filter(d=>d.kind==="AnimationLayer"))for(let d of this.childrenOf(c.id).filter(h=>h.kind==="AnimationCurveNode")){let h=this.connections.find(T=>T.type==="OP"&&T.child===d.id&&this.objects.get(T.parent)?.kind==="Model");if(!h)continue;let m=h.property==="Lcl Translation"?"T":h.property==="Lcl Rotation"?"R":h.property==="Lcl Scaling"?"S":null,p=this.nodeIndexById.get(h.parent);if(!m||p===void 0)continue;let v=Nr(d.node),f=this.model.nodes[p],g=e.get(p)??{T:[],R:[],S:[]},b=m==="T"?f.translation:m==="S"?f.scale:null;["X","Y","Z"].forEach((T,_)=>{let w=this.connections.find(L=>L.type==="OP"&&L.parent===d.id&&L.property===`d|${T}`),S=w&&this.objects.get(w.child);if(S?.kind==="AnimationCurve"){let L=ve(S.node,"KeyTime"),k=ve(S.node,"KeyValueFloat");if(L&&k&&L.length){g[m][_]={times:L,values:k},i=Math.min(i,L[0]),n=Math.max(n,L[L.length-1]);return}}let M=v.get(`d|${T}`)?.[0];g[m][_]=typeof M=="number"?M:b?b[_]:0}),e.set(p,g)}if(!e.size||!isFinite(i))return null;let o=Math.max(1,Math.round((n-i)/Ua*this.fps))+1,s=new Float32Array(o);for(let c=0;c<o;c++)s[c]=c/this.fps;let a=u(c=>i+c/this.fps*Ua,"tick"),l=[];for(let[c,d]of e){let h=this.model.nodes[c],m=this.fbxNodeOf(c);if(d.T.length){let p=new Float32Array(o*3);for(let v=0;v<o;v++)for(let f=0;f<3;f++)p[v*3+f]=Fr(d.T[f],a(v));l.push({target:h.name,property:"translation",times:s,values:p,interpolation:"LINEAR"})}if(d.R.length){let p=Nr(m),v=Number(p.get("RotationOrder")?.[0]??0),f=lr(kt(p.get("PreRotation")),0),g=X.invert(X.create(),lr(kt(p.get("PostRotation")),0)),b=new Float32Array(o*4),T=X.create();for(let _=0;_<o;_++){let w=x.fromValues(Fr(d.R[0],a(_)),Fr(d.R[1],a(_)),Fr(d.R[2],a(_)));X.multiply(T,f,lr(w,v)),X.multiply(T,T,g),X.normalize(T,T),_>0&&T[0]*b[_*4-4]+T[1]*b[_*4-3]+T[2]*b[_*4-2]+T[3]*b[_*4-1]<0&&X.scale(T,T,-1),b.set(T,_*4)}l.push({target:h.name,property:"rotation",times:s,values:b,interpolation:"LINEAR"})}if(d.S.length){let p=new Float32Array(o*3);for(let v=0;v<o;v++)for(let f=0;f<3;f++)p[v*3+f]=Fr(d.S[f],a(v));l.push({target:h.name,property:"scale",times:s,values:p,interpolation:"LINEAR"})}}return new xt(r.name||`Clip ${this.model.clips.length}`,l)}childrenOf(r){let e=[];for(let i of this.connections){if(i.parent!==r)continue;let n=this.objects.get(i.child);n&&e.push(n)}return e}bindPose(){if(this.bindPoseMatrices)return this.bindPoseMatrices;this.bindPoseMatrices=new Map;for(let r of this.objects.values())if(!(r.kind!=="Pose"||r.type!=="BindPose"))for(let e of r.node.children.filter(i=>i.name==="PoseNode")){let i=ve(e,"Node"),n=ve(e,"Matrix");typeof i=="number"&&n&&this.bindPoseMatrices.set(i,za(n))}return this.bindPoseMatrices}globalMatrix(r){let e=this.model.nodes[r],i=E.fromRotationTranslationScale(E.create(),e.rotation,e.translation,e.scale);return e.parent>=0?E.multiply(i,this.globalMatrix(e.parent),i):i}fbxNodeOf(r){for(let[e,i]of this.nodeIndexById)if(i===r)return this.objects.get(e)?.node}};u(Io,"FbxConverter");var Bo=Io;function Oa(t,r,e){let i=ve(t,r);if(!t||!i)return null;let n=String(ve(t,"MappingInformationType")??"ByPolygonVertex"),o=String(ve(t,"ReferenceInformationType")??"Direct"),s=ve(t,e),a=o!=="Direct"&&s instanceof Int32Array;return{data:i,index(l,c,d){let h=n==="ByPolygonVertex"?l:n==="ByPolygon"?d:n==="AllSame"?0:c;return a?s[h]:h}}}u(Oa,"layer");function im(t,r){let e=ve(t,"Vertices")??new Float64Array(0),i=ve(t,"PolygonVertexIndex")??new Int32Array(0),n=Oa(kr(t,"LayerElementNormal"),"Normals","NormalsIndex"),o=Oa(kr(t,"LayerElementUV"),"UV","UVIndex"),s=Array.from({length:e.length/3},()=>[]);r.forEach((g,b)=>{let T=ve(g,"Indexes"),_=ve(g,"Weights");if(!(!T||!_))for(let w=0;w<T.length;w++)s[T[w]]?.push([b,_[w]])});let a=r.length>0,l=a?new ot([]):new K([]);l.providedNormals=!!n;let c=[],d=[],h=new Map,m=0,p=u((g,b,T)=>{let _=n?n.index(g,b,T):-1,w=o?o.index(g,b,T):-1,S=`${b}/${_}/${w}`,M=h.get(S);if(M!==void 0)return M;if(M=l.vertices.length,h.set(S,M),l.vertices.push(x.fromValues(e[b*3],e[b*3+1],e[b*3+2])),n&&l.normals.push(x.fromValues(n.data[_*3],n.data[_*3+1],n.data[_*3+2])),l.uvs.push(o?ce.fromValues(o.data[w*2],1-o.data[w*2+1]):ce.create()),a){let L=s[b].slice().sort((I,D)=>D[1]-I[1]).slice(0,4),k=L.reduce((I,D)=>I+D[1],0);k<=0&&m++;for(let I=0;I<4;I++)c.push(L[I]?.[0]??0),d.push(k>0?(L[I]?.[1]??0)/k:I===0?1:0)}return M},"addVertex"),v=[],f=0;for(let g=0;g<i.length;g++){let b=i[g],T=b<0?~b:b;if(v.push(p(g,T,f)),b<0){for(let _=1;_+1<v.length;_++)l.indices.push(v[0],v[_],v[_+1]);v=[],f++}}return l instanceof ot&&(l.joints=Uint16Array.from(c),l.weights=Float32Array.from(d),m&&console.warn(`FBX: ${m} skinned vertices had no weights; bound to the first bone.`)),l}u(im,"buildMesh");function nm(t){let r=Nr(t),e=Number(r.get("RotationOrder")?.[0]??0),i=X.multiply(X.create(),lr(kt(r.get("PreRotation")),0),lr(kt(r.get("Lcl Rotation")),e)),n=lr(kt(r.get("PostRotation")),0);X.multiply(i,i,X.invert(n,n)),X.normalize(i,i);let o=r.has("Lcl Scaling")?kt(r.get("Lcl Scaling")):x.fromValues(1,1,1);for(let s of["RotationPivot","ScalingPivot","RotationOffset","ScalingOffset"]){let a=r.get(s);if(a&&(a[0]||a[1]||a[2])){console.warn(`FBX: ${s} of "${Va(String(t.props[1]))}" is ignored.`);break}}return{translation:kt(r.get("Lcl Translation")),rotation:i,scale:o}}u(nm,"localTransform");var om=["XYZ","XZY","YZX","YXZ","ZXY","ZYX","XYZ"],sm={X:[1,0,0],Y:[0,1,0],Z:[0,0,1]};function lr(t,r){let e=X.create(),i=X.create();for(let n of om[r]??"XYZ"){let o=t["XYZ".indexOf(n)]*(Math.PI/180);X.setAxisAngle(i,sm[n],o),X.multiply(e,i,e)}return e}u(lr,"eulerToQuat");function za(t){return t&&t.length===16?E.clone(Array.from(t)):E.create()}u(za,"matrixOf");function kt(t){return t?x.fromValues(Number(t[0])||0,Number(t[1])||0,Number(t[2])||0):x.create()}u(kt,"vec3Of");function Fr(t,r){if(typeof t=="number")return t;let{times:e,values:i}=t,n=e.length;if(r<=e[0])return i[0];if(r>=e[n-1])return i[n-1];let o=0,s=n-1;for(;s-o>1;){let l=o+s>>1;e[l]<=r?o=l:s=l}let a=(r-e[o])/(e[s]-e[o]);return i[o]+(i[s]-i[o])*a}u(Fr,"evaluate");function Nr(t){let r=new Map;for(let e of kr(t,"Properties70")?.children??[])r.set(String(e.props[0]),e.props.slice(4));return r}u(Nr,"props70");function Va(t){let r=t??"";if(r.includes("\0"))return r.split("\0")[0];let e=r.indexOf("::");return e>=0?r.slice(e+2):r}u(Va,"cleanName");function am(t,r){return t[0]===137&&t[1]===80?"image/png":t[0]===255&&t[1]===216||/\.jpe?g$/i.test(r)?"image/jpeg":"image/png"}u(am,"mimeOf");var lm={lt:"<",gt:">",amp:"&",quot:'"',apos:"'"};function Wa(t){return t.indexOf("&")<0?t:t.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi,(r,e)=>e[0]==="#"?String.fromCodePoint(e[1]==="x"||e[1]==="X"?parseInt(e.slice(2),16):parseInt(e.slice(1),10)):lm[e]??r)}u(Wa,"decode");function Ha(t){let r={tag:"#document",attrs:{},children:[],text:""},e=[r],i=[[]],n=t.length,o=0,s=u(()=>{let a=e.pop();a.text=Wa(i.pop().join(""))},"closeTop");for(;o<n;){let a=t.indexOf("<",o);if(a<0){i[i.length-1].push(t.slice(o));break}if(a>o&&i[i.length-1].push(t.slice(o,a)),t.startsWith("<!--",a)){let f=t.indexOf("-->",a+4);o=f<0?n:f+3;continue}if(t.startsWith("<![CDATA[",a)){let f=t.indexOf("]]>",a+9);i[i.length-1].push(t.slice(a+9,f<0?n:f)),o=f<0?n:f+3;continue}if(t[a+1]==="?"||t[a+1]==="!"){let f=t.indexOf(">",a);o=f<0?n:f+1;continue}let l=cm(t,a);if(t[a+1]==="/"){let f=t.slice(a+2,l).trim();for(;e.length>1;){let g=e[e.length-1];if(s(),g.tag===f)break}o=l+1;continue}let c=t[l-1]==="/",d=t.slice(a+1,c?l-1:l),h=/^\s*([^\s/>]+)/.exec(d),m={tag:h?h[1]:"",attrs:{},children:[],text:""},p=/([^\s=]+)\s*=\s*("([^"]*)"|'([^']*)')/g,v=d.slice(h?h[0].length:0);for(let f=p.exec(v);f;f=p.exec(v))m.attrs[f[1]]=Wa(f[3]??f[4]??"");e[e.length-1].children.push(m),c||(e.push(m),i.push([])),o=l+1}for(;e.length>1;)s();return r}u(Ha,"parseXml");function cm(t,r){let e="";for(let i=r+1;i<t.length;i++){let n=t[i];if(e)n===e&&(e="");else if(n==='"'||n==="'")e=n;else if(n===">")return i}return t.length-1}u(cm,"findTagEnd");function $(t,r){return t?.children.find(e=>e.tag===r)}u($,"xmlChild");function Le(t,r){return t?t.children.filter(e=>e.tag===r):[]}u(Le,"xmlChildren");function Ft(t,r,e=[]){for(let i of t?.children??[])i.tag===r&&e.push(i),Ft(i,r,e);return e}u(Ft,"xmlDescendants");function Ja(t){return new TextDecoder("utf-8").decode(new Uint8Array(t,0,Math.min(t.byteLength,2048))).includes("<COLLADA")}u(Ja,"isCollada");function qa(t){return new ko(Ha(t)).convert()}u(qa,"parseCollada");var Fo=class Fo{constructor(r){this.ids=new Map;this.model={nodes:[],meshes:[],skins:[],clips:[],materials:[],images:[],unitScale:1};this.nodeIndex={byId:new Map,bySid:new Map,byName:new Map};this.imageIndexById=new Map;this.materialIndexById=new Map;this.geometryCache=new Map;this.pendingSkins=[];this.collada=$(r,"COLLADA")??r;let e=u(i=>{i.attrs.id&&this.ids.set(i.attrs.id,i),i.children.forEach(e)},"index");e(this.collada)}convert(){let r=$(this.collada,"asset"),e=Number($(r,"unit")?.attrs.meter);e>0&&(this.model.unitScale=e);let i=$(r,"up_axis")?.text.trim();i&&i!=="Y_UP"&&console.warn(`COLLADA: ${i} is not converted; the model may lie on its side.`);let n=$($(this.collada,"scene"),"instance_visual_scene")?.attrs.url,o=n&&this.ref(n)||Ft(this.collada,"visual_scene")[0];for(let s of Le(o,"node"))this.readNode(s,-1);for(let s of this.pendingSkins)this.readSkin(s);return this.readAnimations(),this.model}readNode(r,e){let i=this.model.nodes.length,n=this.localMatrix(r),o={name:r.attrs.name||r.attrs.id||r.attrs.sid||`Node ${i}`,parent:e,translation:E.getTranslation(x.create(),n),rotation:X.normalize(X.create(),E.getRotation(X.create(),n)),scale:E.getScaling(x.create(),n)};this.model.nodes.push(o),r.attrs.id&&this.nodeIndex.byId.set(r.attrs.id,i),r.attrs.sid&&this.nodeIndex.bySid.set(r.attrs.sid,i),this.nodeIndex.byName.set(o.name,i);for(let s of Le(r,"instance_geometry")){let a=this.ref(s.attrs.url);a&&this.attachPrimitives(i,this.readGeometry(a),this.materialBindings(s))}for(let s of Le(r,"instance_controller")){let a=this.ref(s.attrs.url);if(a){let l=$(s,"skeleton")?.text.trim();this.pendingSkins.push({node:i,controller:a,skeleton:l,bindings:this.materialBindings(s)})}}for(let s of Le(r,"node"))this.readNode(s,i)}localMatrix(r){let e=E.create();for(let i of r.children){let n=yt(i.text);i.tag==="matrix"&&n.length>=16?E.multiply(e,e,Li(n)):i.tag==="translate"?E.translate(e,e,[n[0],n[1],n[2]]):i.tag==="rotate"?E.rotate(e,e,n[3]*Math.PI/180,[n[0],n[1],n[2]]):i.tag==="scale"&&E.scale(e,e,[n[0],n[1],n[2]])}return e}materialBindings(r){let e=new Map;for(let i of Ft(r,"instance_material"))e.set(i.attrs.symbol,i.attrs.target.replace(/^#/,""));return e}attachPrimitives(r,e,i,n){e.forEach((o,s)=>{let a=r;if(s>0){a=this.model.nodes.length;let h=this.model.nodes[r];this.model.nodes.push({name:`${h.name} (${o.material||s})`,parent:r,translation:x.create(),rotation:X.create(),scale:x.fromValues(1,1,1)})}let l=this.model.nodes[a];l.mesh=this.model.meshes.length,this.model.meshes.push(o.mesh),n!==void 0&&(l.skin=n);let c=i.get(o.material)??o.material,d=c?this.readMaterial(c):void 0;d!==void 0&&(l.material=d)})}readGeometry(r){let e=this.geometryCache.get(r.attrs.id);if(e)return e;let i=$(r,"mesh"),n=[];for(let o of i?.children??[])["triangles","polylist","polygons"].includes(o.tag)&&n.push(this.readPrimitive(i,o));return this.geometryCache.set(r.attrs.id,n),n}readPrimitive(r,e){let i=[];for(let f of Le(e,"input")){let g=Number(f.attrs.offset??0);if(f.attrs.semantic==="VERTEX"){let b=this.ref(f.attrs.source);for(let T of Le(b,"input")){let _=this.readSource(this.ref(T.attrs.source));i.push({semantic:T.attrs.semantic,offset:g,..._})}}else(f.attrs.semantic==="NORMAL"||f.attrs.semantic==="TEXCOORD"&&!i.some(b=>b.semantic==="TEXCOORD"))&&i.push({semantic:f.attrs.semantic,offset:g,...this.readSource(this.ref(f.attrs.source))})}let n=Math.max(...Le(e,"input").map(f=>Number(f.attrs.offset??0)))+1,o=i.find(f=>f.semantic==="POSITION"),s=i.find(f=>f.semantic==="NORMAL"),a=i.find(f=>f.semantic==="TEXCOORD"),l=Le(e,"p").map(f=>yt(f.text)),c=[],d=[];if(e.tag==="polylist")c.push(...yt($(e,"vcount")?.text??"")),d=l[0]??[];else if(e.tag==="triangles"){d=l[0]??[];for(let f=0;f<d.length/n/3;f++)c.push(3)}else for(let f of l)c.push(f.length/n),d.push(...f);let h=new K([]);h.providedNormals=!!s;let m=[],p=new Map,v=0;for(let f of c){let g=[];for(let b=0;b<f;b++,v++){let T=v*n,_=o?d[T+o.offset]:0,w=s?d[T+s.offset]:-1,S=a?d[T+a.offset]:-1,M=`${_}/${w}/${S}`,L=p.get(M);if(L===void 0){L=h.vertices.length,p.set(M,L),m.push(_);let k=o.data,I=o.stride;h.vertices.push(x.fromValues(k[_*I],k[_*I+1],k[_*I+2])),s&&h.normals.push(x.fromValues(s.data[w*s.stride],s.data[w*s.stride+1],s.data[w*s.stride+2])),h.uvs.push(a?ce.fromValues(a.data[S*a.stride],1-a.data[S*a.stride+1]):ce.create())}g.push(L)}for(let b=1;b+1<g.length;b++)h.indices.push(g[0],g[b],g[b+1])}return{mesh:h,material:e.attrs.material??"",positionOf:m}}readSkin(r){let e=$(r.controller,"skin"),i=e&&this.ref(e.attrs.source);if(!e||!i)return;let n=Li(yt($(e,"bind_shape_matrix")?.text??"1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1")),o=Le($(e,"joints"),"input"),s=this.readNames(this.ref(o.find(M=>M.attrs.semantic==="JOINT")?.attrs.source)),a=this.readSource(this.ref(o.find(M=>M.attrs.semantic==="INV_BIND_MATRIX")?.attrs.source)),l={joints:[],inverseBindMatrices:[]};s.forEach((M,L)=>{let k=this.nodeIndex.bySid.get(M)??this.nodeIndex.byName.get(M)??this.nodeIndex.byId.get(M);k===void 0&&console.warn(`COLLADA: joint "${M}" has no node; using the first node.`),l.joints.push(k??0);let I=Li(Array.from(a.data.subarray(L*16,L*16+16)));l.inverseBindMatrices.push(E.multiply(I,I,n))});let c=$(e,"vertex_weights"),d=Le(c,"input"),h=Math.max(...d.map(M=>Number(M.attrs.offset??0)))+1,m=Number(d.find(M=>M.attrs.semantic==="JOINT")?.attrs.offset??0),p=d.find(M=>M.attrs.semantic==="WEIGHT"),v=Number(p?.attrs.offset??1),f=this.readSource(this.ref(p?.attrs.source)).data,g=yt($(c,"vcount")?.text??""),b=yt($(c,"v")?.text??""),T=[],_=0;g.forEach((M,L)=>{let k=[];for(let I=0;I<M;I++,_++){let D=b[_*h+m],O=f[b[_*h+v]];D>=0&&k.push([D,O])}T[L]=k});let w=this.model.skins.length;this.model.skins.push(l);let S=this.readGeometry(i).map(M=>({...M,mesh:um(M,T)}));this.attachPrimitives(r.node,S,r.bindings,w)}readMaterial(r){let e=this.materialIndexById.get(r);if(e!==void 0)return e;let i=this.ids.get(r);if(!i)return;let n=this.ref($(i,"instance_effect")?.attrs.url),o={name:i.attrs.name||r,color:[.8,.8,.8,1]},s=$(n,"profile_COMMON"),a=new Map;for(let g of Le(s,"newparam"))a.set(g.attrs.sid,g);let l=u(g=>{let b=a.get(g),T=$($(b,"sampler2D"),"source")?.text.trim(),_=T?a.get(T):void 0,w=$($(_,"surface"),"init_from")?.text.trim()??g;return this.readImage(w)},"imageOfSampler"),d=$(s,"technique")?.children.find(g=>["phong","lambert","blinn","constant"].includes(g.tag)),h=u(g=>$(d,g),"slot"),m=u(g=>{let b=$(g,"texture");return b?l(b.attrs.texture):void 0},"texture"),p=h("diffuse");o.albedo=m(p);let v=yt($(p,"color")?.text??"");o.albedo!==void 0?o.color=[1,1,1,1]:v.length>=3&&(o.color=[v[0],v[1],v[2],1]),o.emissive=m(h("emission")),o.specular=m(h("specular"));let f=Ft(n,"bump")[0]??Ft(n,"displacement")[0];return o.normal=m(f),this.materialIndexById.set(r,this.model.materials.length),this.model.materials.push(o),this.model.materials.length-1}readImage(r){let e=this.imageIndexById.get(r);if(e!==void 0)return e;let i=this.ids.get(r),n=$(i,"init_from"),o=($(n,"ref")?.text??n?.text??"").trim();if(!i||!o)return;let s=decodeURIComponent(o.split(/[\\/]/).pop()??o);return this.imageIndexById.set(r,this.model.images.length),this.model.images.push({name:s,mimeType:/\.jpe?g$/i.test(s)?"image/jpeg":"image/png",path:o.replace(/^file:\/\/\/?/,"")}),this.model.images.length-1}readAnimations(){let r=[],e=0;for(let i of Ft($(this.collada,"library_animations"),"animation"))for(let n of Le(i,"channel")){let[o,s]=(n.attrs.target??"").split("/"),a=this.nodeIndex.byId.get(o),l=this.ref(n.attrs.source);if(a===void 0||!l)continue;let c=Le(l,"input"),d=this.readSource(this.ref(c.find(m=>m.attrs.semantic==="INPUT")?.attrs.source)).data,h=this.readSource(this.ref(c.find(m=>m.attrs.semantic==="OUTPUT")?.attrs.source));if(h.stride!==16||!/^(transform|matrix)/.test(s??"")){e++;continue}r.push(...dm(this.model.nodes[a].name,d,h.data))}e&&console.warn(`COLLADA: ${e} animation channels that are not whole matrices were skipped.`),r.length&&this.model.clips.push(new xt("Animation",r))}ref(r){return r?this.ids.get(r.replace(/^#/,"")):void 0}readSource(r){let e=$(r,"float_array"),i=$($(r,"technique_common"),"accessor");return{data:Float64Array.from(yt(e?.text??"")),stride:Number(i?.attrs.stride??1)}}readNames(r){return(($(r,"Name_array")??$(r,"IDREF_array"))?.text??"").trim().split(/\s+/).filter(Boolean)}};u(Fo,"ColladaConverter");var ko=Fo;function yt(t){let r=[];for(let e of t.split(/\s+/))e&&r.push(Number(e));return r}u(yt,"numbers");function Li(t){let r=E.create();for(let e=0;e<4;e++)for(let i=0;i<4;i++)r[i*4+e]=t[e*4+i];return r}u(Li,"rowMajor");function um(t,r){let e=t.mesh,i=new ot(e.vertices,e.normals,e.uvs,e.indices);i.providedNormals=e.providedNormals;let n=new Uint16Array(e.vertices.length*4),o=new Float32Array(e.vertices.length*4);return t.positionOf.forEach((s,a)=>{let l=(r[s]??[]).slice().sort((d,h)=>h[1]-d[1]).slice(0,4),c=l.reduce((d,h)=>d+h[1],0);for(let d=0;d<4;d++)n[a*4+d]=l[d]?.[0]??0,o[a*4+d]=c>0?(l[d]?.[1]??0)/c:d===0?1:0}),i.joints=n,i.weights=o,i}u(um,"toSkinned");function dm(t,r,e){let i=r.length,n=new Float32Array(i*3),o=new Float32Array(i*4),s=new Float32Array(i*3),a=E.create(),l=X.create(),c=x.create();for(let h=0;h<i;h++)E.copy(a,Li(e.subarray(h*16,h*16+16))),n.set(E.getTranslation(c,a),h*3),E.getRotation(l,a),X.normalize(l,l),h>0&&l[0]*o[h*4-4]+l[1]*o[h*4-3]+l[2]*o[h*4-2]+l[3]*o[h*4-1]<0&&X.scale(l,l,-1),o.set(l,h*4),s.set(E.getScaling(c,a),h*3);let d=Float32Array.from(r);return[{target:t,property:"translation",times:d,values:n,interpolation:"LINEAR"},{target:t,property:"rotation",times:d,values:o,interpolation:"LINEAR"},{target:t,property:"scale",times:d,values:s,interpolation:"LINEAR"}]}u(dm,"matrixChannels");var st=class st{constructor(r,e){this.gl=r;this.loader=e;this.objParser=new Ei;this.renderTextures=new Map;this.builtinLoader=new nt(async r=>ar(r)??r);this.missingLoader=new nt(async()=>ar(Me.missing));this.modelImageLoader={loadText:u(r=>this.loader.loadText(r),"loadText"),loadImage:u(async r=>{let e=bt(r),i=(await this.getModel(e.modelUri)).images[e.index];if(!i)throw new Error(`${r}: the model has no image ${e.index}.`);if(i.data)return createImageBitmap(new Blob([i.data],{type:i.mimeType}));if(i.path&&/^(https?:|\/|\.)/.test(e.modelUri))return this.loader.loadImage(new URL(i.path,new URL(e.modelUri,location.href)).href);throw new Error(`${r}: the image "${i.path}" is a separate file; place the model with instantiateModel's resolveImage.`)},"loadImage")};this.textures=new gt({load:u(async i=>{if(wo(i))return this.getRenderTexture(i);let n=new qe(this.requireGl(i),i);n.loader=ar(i)?this.builtinLoader:bt(i)?.kind==="image"?this.modelImageLoader:this.loader;try{await n.load()}catch(o){console.warn(`Texture ${i} could not be loaded; using the missing texture.`,o),n.loader=this.missingLoader,await n.load()}return n},"load"),dispose:u(i=>{i instanceof Ir||i.destroy()},"dispose")}),this.cubemaps=new gt({load:u(async i=>{let n=new sr(this.requireGl(i),i.split("|"));return await n.load(),n},"load"),dispose:u(i=>i.destroy(),"dispose")}),this.meshes=new gt({load:u(async i=>this.objParser.parse(await this.loader.loadText(i)),"load")}),this.models=new gt({load:u(async i=>{let n=await this.loadBinary(i);if(Ba(n))return Ga(n);if(Ja(n))return qa(new TextDecoder("utf-8").decode(n));throw new Error(`${i} is not a model format the engine reads (FBX 7.x, COLLADA).`)},"load")}),this.shaders=new gt({load:u(async i=>vt[i]??this.loader.loadText(i),"load")})}static cubemapKey(r){let{right:e,left:i,up:n,bottom:o,front:s,back:a}=r;return[e,i,n,o,s,a].join("|")}async getTexture(r){return st.peekValue(await this.textures.acquire(r))}async getCubemap(r){return st.peekValue(await this.cubemaps.acquire(st.cubemapKey(r)))}getRenderTexture(r){let e=To(r),i=this.renderTextures.get(e);return i||(i=new Ir(this.requireGl(e),e),this.renderTextures.set(e,i)),i}getWhiteCubemap(){let r=Me.white;return this.getCubemap({right:r,left:r,up:r,bottom:r,front:r,back:r})}async getMesh(r){return st.peekValue(await this.meshes.acquire(r))}async getModel(r){return st.peekValue(await this.models.acquire(r.split("#")[0]))}async loadBinary(r){if(this.loader.loadBinary)return this.loader.loadBinary(r);let e=await fetch(r);if(!e.ok)throw new Error(`Failed to load ${r} (HTTP ${e.status})`);return e.arrayBuffer()}async getShader(r){return st.peekValue(await this.shaders.acquire(r))}static peekValue(r){return r.release(),r.value}setLoader(r){this.loader=r}getLoader(){return this.loader}stats(){return{textures:this.textures.stats(),cubemaps:this.cubemaps.stats(),meshes:this.meshes.stats(),shaders:this.shaders.stats(),models:this.models.stats()}}trim(){return this.textures.trim()+this.cubemaps.trim()+this.meshes.trim()+this.shaders.trim()+this.models.trim()}dispose(){this.textures.clear(),this.cubemaps.clear(),this.meshes.clear(),this.shaders.clear(),this.models.clear();for(let r of this.renderTextures.values())r.destroy();this.renderTextures.clear()}requireGl(r){if(!this.gl)throw new Error(`Cannot load ${r}: no WebGL context is known yet.`);return this.gl}};u(st,"ResourceManager");var Ur=st;var Q=class Q{static for(r){let e=r??Q.currentGl;r&&(Q.currentGl=r);let i=Q.managers.get(e);return i||(i=new Ur(e,Q.loader),Q.managers.set(e,i)),i}static setLoader(r){Q.customLoader=r;for(let e of Q.managers.values())e.setLoader(Q.loader)}static setUriResolver(r){Q.uriResolver=r}static async resolveUri(r){let e=ar(r);return e||(Q.uriResolver?await Q.uriResolver(r):r)}static releaseContext(r){let e=Q.managers.get(r);e&&(e.dispose(),Q.managers.delete(r),Q.currentGl===r&&(Q.currentGl=null))}static forgetTexture(r){let e=r.textureUri;if(e){for(let i of Q.managers.values())if(i.textures.remove(e,r))return}}static trim(){let r=0;for(let e of Q.managers.values())r+=e.trim();return r}static stats(){return[...Q.managers.values()].map(r=>r.stats())}static clear(){for(let r of Q.managers.values())r.dispose();Q.managers.clear(),Q.currentGl=null}static get loader(){return Q.customLoader??Q.defaultLoader}};u(Q,"Resources"),Q.managers=new Map,Q.currentGl=null,Q.uriResolver=null,Q.customLoader=null,Q.defaultLoader=new nt(r=>Q.resolveUri(r));var W=Q;var $e=class $e extends q{constructor(e,i,n=ne.frag.color,o=ne.vertex.default){super("Shader");this.gl=e;this.material=i;this.fragUri=n;this.vertexUri=o;this._className="Shader";this._initialized=!1;this._buffers={position:null,normal:null,uv:null,tangent:null,bitangent:null,indices:null};this.fragmentSource=null;this.vertexSource=null;this.defines=[];this.indexType=5123;this._uuid=Ze()}static preFetchFunctionsGlsl(){for(let e of Object.values($e.SHADER_FUNCTIONS))W.for().getShader(e)}static instanciate(e,i){return new $e(e,i)}get shaderProgram(){return this._shaderProgram}get initialized(){return this._initialized}get buffers(){return this._buffers}async initialize(){if(this._initialized)return!0;let e=Object.keys($e.SHADER_FUNCTIONS),i=await W.for().getShader(this.vertexUri),n=await W.for().getShader(this.fragUri);i.trim().startsWith("<")&&console.warn(`[Shader Warning] Vertex source from ${this.vertexUri} starts with '<'. It may be HTML.`),n.trim().startsWith("<")&&console.warn(`[Shader Warning] Fragment source from ${this.fragUri} starts with '<'. It may be HTML.`);for(let a of e)if(n.includes(a)){let l=$e.SHADER_FUNCTIONS[a],c=await W.for().getShader(l);n=n.replace(a,c)}i=$e.withDefines(i,this.defines),n=$e.withDefines(n,this.defines);let o=this.compileShader(this.gl,this.gl.VERTEX_SHADER,i,this.vertexUri),s=this.compileShader(this.gl,this.gl.FRAGMENT_SHADER,n,this.fragUri);return!o||!s?!1:(this._shaderProgram=this.createProgram(this.gl,o,s),this._initialized=!0,!0)}static withDefines(e,i){if(!i.length)return e;let n=i.map(s=>`#define ${s}`).join(`
`)+`
`,o=/^\s*#version[^\n]*\n/.exec(e);return o?e.slice(0,o[0].length)+n+e.slice(o[0].length):n+e}initBuffers(e,i){(!i.providedNormals||i.normals.length!==i.vertices.length)&&i.calculateNormals(),i.calculateTangentsAndBitangents();let n={position:null,normal:null,uv:null,tangent:null,bitangent:null,indices:null};n.position=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,n.position);let o=[];for(let c of i.vertices)o.push(c[0],c[1],c[2]);e.bufferData(e.ARRAY_BUFFER,new Float32Array(o),e.STATIC_DRAW),n.normal=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,n.normal);let s=[];for(let c of i.normals)s.push(c[0],c[1],c[2]);e.bufferData(e.ARRAY_BUFFER,new Float32Array(s),e.STATIC_DRAW),n.uv=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,n.uv);let a=[];for(let c of i.uvs)a.push(c[0],c[1]);if(e.bufferData(e.ARRAY_BUFFER,new Float32Array(a),e.STATIC_DRAW),i.tangents&&i.tangents.length>0){n.tangent=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,n.tangent);let c=[];for(let d of i.tangents)c.push(d[0],d[1],d[2]);e.bufferData(e.ARRAY_BUFFER,new Float32Array(c),e.STATIC_DRAW)}if(i.bitangents&&i.bitangents.length>0){n.bitangent=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,n.bitangent);let c=[];for(let d of i.bitangents)c.push(d[0],d[1],d[2]);e.bufferData(e.ARRAY_BUFFER,new Float32Array(c),e.STATIC_DRAW)}i instanceof ot&&i.joints.length&&(n.joints=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,n.joints),e.bufferData(e.ARRAY_BUFFER,i.joints,e.STATIC_DRAW),n.weights=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,n.weights),e.bufferData(e.ARRAY_BUFFER,i.weights,e.STATIC_DRAW));let l=i.vertices.length>65535;this.indexType=l?e.UNSIGNED_INT:e.UNSIGNED_SHORT,n.indices=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.indices),e.bufferData(e.ELEMENT_ARRAY_BUFFER,l?new Uint32Array(i.indices):new Uint16Array(i.indices),e.STATIC_DRAW),this._buffers=n}bindBuffers(){if(!this.gl||!this._shaderProgram)return;let e=this.gl.getAttribLocation(this._shaderProgram,"a_position");this._buffers.position&&e!==-1?(this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._buffers.position),this.gl.vertexAttribPointer(e,3,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(e)):e!==-1&&this.gl.disableVertexAttribArray(e);let i=this.gl.getAttribLocation(this._shaderProgram,"a_normal");this._buffers.normal&&i!==-1?(this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._buffers.normal),this.gl.vertexAttribPointer(i,3,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(i)):i!==-1&&this.gl.disableVertexAttribArray(i);let n=this.gl.getAttribLocation(this._shaderProgram,"a_uv");this._buffers.uv&&n!==-1?(this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._buffers.uv),this.gl.vertexAttribPointer(n,2,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(n)):n!==-1&&this.gl.disableVertexAttribArray(n);let o=this.gl.getAttribLocation(this._shaderProgram,"a_tangent");this._buffers.tangent&&o!==-1?(this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._buffers.tangent),this.gl.vertexAttribPointer(o,3,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(o)):o!==-1&&this.gl.disableVertexAttribArray(o);let s=this.gl.getAttribLocation(this._shaderProgram,"a_bitangent");this._buffers.bitangent&&s!==-1?(this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._buffers.bitangent),this.gl.vertexAttribPointer(s,3,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(s)):s!==-1&&this.gl.disableVertexAttribArray(s),this.bindSkinAttributes(this._shaderProgram),this._buffers.indices&&this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this._buffers.indices)}bindSkinAttributes(e){let i=this.gl,n=i.getAttribLocation(e,"a_joints"),o=i.getAttribLocation(e,"a_weights");n!==-1&&(this._buffers.joints?(i.bindBuffer(i.ARRAY_BUFFER,this._buffers.joints),i.vertexAttribIPointer(n,4,i.UNSIGNED_SHORT,0,0),i.enableVertexAttribArray(n)):i.disableVertexAttribArray(n)),o!==-1&&(this._buffers.weights?(i.bindBuffer(i.ARRAY_BUFFER,this._buffers.weights),i.vertexAttribPointer(o,4,i.FLOAT,!1,0,0),i.enableVertexAttribArray(o)):i.disableVertexAttribArray(o))}use(){!this._shaderProgram||!this._initialized||this.gl.useProgram(this._shaderProgram)}release(){}loadDataIntoShader(){if(!this.material)return;this.use();let e=this.material;e&&this.setVec4("u_matColor",e.color.toVec4())}setMat4(e,i){let n=this.gl.getUniformLocation(this._shaderProgram,e);n&&(this.use(),this.gl.uniformMatrix4fv(n,!1,Float32Array.from(i)))}setMat3(e,i){let n=this.gl.getUniformLocation(this._shaderProgram,e);n&&this.gl.uniformMatrix3fv(n,!1,Float32Array.from(i))}setVec4(e,i){let n=this.gl.getUniformLocation(this._shaderProgram,e);n&&this.gl.uniform4fv(n,Float32Array.from(i))}setVec3(e,i){let n=this.gl.getUniformLocation(this._shaderProgram,e);n&&this.gl.uniform3fv(n,Float32Array.from(i))}setVec2(e,i){let n=this.gl.getUniformLocation(this._shaderProgram,e);n&&this.gl.uniform2fv(n,Float32Array.from(i))}setFloat(e,i){let n=this.gl.getUniformLocation(this._shaderProgram,e);n&&this.gl.uniform1f(n,i)}setInt(e,i){this.use();let n=this.gl.getUniformLocation(this._shaderProgram,e);n&&this.gl.uniform1i(n,i)}setTexture(e,i,n){this.use();let o=this.gl.getUniformLocation(this._shaderProgram,e);o&&(this.gl.activeTexture(this.gl.TEXTURE0+n),this.gl.bindTexture(this.gl.TEXTURE_2D,i.glTexture),this.gl.uniform1i(o,n))}setBuffer(e,i){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,e),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(i.flat()),this.gl.STATIC_DRAW)}setIndices(e){this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this._buffers.indices);let i=new Uint16Array(e);this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,i,this.gl.STATIC_DRAW)}compileShader(e,i,n,o){let s=e.createShader(i);if(!s)return null;if(e.shaderSource(s,n),e.compileShader(s),!e.getShaderParameter(s,e.COMPILE_STATUS)){let a=i===e.VERTEX_SHADER?"Vertex":"Fragment",l=e.getShaderInfoLog(s),c=n.split(`
`),d=c.slice(0,15).join(`
`)+(c.length>15?`
...`:"");return console.error(`[Shader Compilation Error] ${a} Shader failed: ${o}`),console.error(`Info Log:
${l}`),console.error(`Source Preview:
${d}`),e.deleteShader(s),null}return s}createProgram(e,i,n){let o=e.createProgram();if(!o)return null;if(this._shaderProgram&&this.gl.deleteProgram(this._shaderProgram),e.attachShader(o,i),e.attachShader(o,n),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS))return console.trace("Unable to initialize the shader program:",e.getProgramInfoLog(o)),null;let s=[["CameraBlock",0],["LightsBlock",1],["ShadowsBlock",2]];for(let[a,l]of s){let c=e.getUniformBlockIndex(o,a);c!==e.INVALID_INDEX&&e.uniformBlockBinding(o,c,l)}return o}recompile(){this._initialized=!1,this.initialize()}destroy(){this._buffers.position&&this.gl.deleteBuffer(this._buffers.position),this._buffers.normal&&this.gl.deleteBuffer(this._buffers.normal),this._buffers.uv&&this.gl.deleteBuffer(this._buffers.uv),this._buffers.tangent&&this.gl.deleteBuffer(this._buffers.tangent),this._buffers.bitangent&&this.gl.deleteBuffer(this._buffers.bitangent),this._buffers.indices&&this.gl.deleteBuffer(this._buffers.indices),this._buffers.joints&&this.gl.deleteBuffer(this._buffers.joints),this._buffers.weights&&this.gl.deleteBuffer(this._buffers.weights),this._shaderProgram&&this.gl.deleteProgram(this._shaderProgram),this._initialized=!1}toJsonObject(){return{...super.toJsonObject(),uuid:this.uuid,type:this.constructor.name,fragUri:this.fragUri,vertexUri:this.vertexUri,material:this.material?.toJsonObject()}}fromJson(e){super.fromJson(e),this.deserializeAutomatically(e)}};u($e,"Shader"),$e.SHADER_FUNCTIONS={"@INCLUDE_FOG_FUNC":ne.frag.fog,"@INCLUDE_LIGHT_FUNC":ne.frag.light,"@INCLUDE_UTIL_FUNC":ne.frag.functions};var Ie=$e;var Ut=4096,Ge={directional:1,spot:4,point:2},No=Ge.directional+Ge.spot+Ge.point,Nt=Ge.directional+Ge.spot+6*Ge.point,Ya=95,Xi={directional:[{x:0,y:0,size:2048}],spot:[0,1,2,3].map(t=>({x:2048+t%2*1024,y:Math.floor(t/2)*1024,size:1024})),point:Array.from({length:12},(t,r)=>({x:r%4*512,y:2048+Math.floor(r/4)*512,size:512}))};function hm(t,r){if(r===Ut)return t;let e=r/Ut;return{x:t.x*e,y:t.y*e,size:t.size*e}}u(hm,"scaledTile");function $a(t,r,e){let i=t.filter(h=>h.castShadows),n=u((h,m)=>i.filter(p=>p.entityType===h).map(p=>({l:p,d:x.distance(p.transform.worldPosition,r)})).sort((p,v)=>p.d-v.d).slice(0,m).sort((p,v)=>t.indexOf(p.l)-t.indexOf(v.l)).map(p=>p.l),"nearest"),o=e.atlasSize??Ut,s=Math.min(Ge.spot,Math.max(0,e.budget?.spot??Ge.spot)),a=Math.min(Ge.point,Math.max(0,e.budget?.point??Ge.point)),l=u(h=>hm(h,o),"tile"),c={atlasSize:o,slots:[],views:[],slotOf:new Map},d=u((h,m,p,v)=>{c.slotOf.set(h,c.slots.length),c.slots.push({light:h,firstView:c.views.length,viewCount:m.length,texelSize:p,perspective:v});for(let f of m)c.views.push({light:h,...f})},"addSlot");return n(1,Ge.directional).forEach((h,m)=>{let p=l(Xi.directional[m]),v=mm(h.direction,r,e.directionalDistance,p.size);d(h,[{rect:p,matrix:v}],2*e.directionalDistance/p.size,!1)}),n(3,s).forEach((h,m)=>{let p=l(Xi.spot[m]);d(h,[{rect:p,matrix:fm(h)}],2*Math.tan(ja(h)/2)/p.size,!0)}),n(2,a).forEach((h,m)=>{let p=l(Xi.point[m*6]).size,v=2*Math.tan(Ya*Math.PI/360)/p;d(h,gm(h).map((f,g)=>({matrix:f,rect:l(Xi.point[m*6+g])})),v,!0)}),c}u($a,"planShadows");function mm(t,r,e,i){let n=x.normalize(x.create(),t),o=Math.abs(n[1])>.999?x.fromValues(0,0,1):x.fromValues(0,1,0),s=x.scaleAndAdd(x.create(),r,n,-e),a=E.lookAt(E.create(),s,r,o),l=E.ortho(E.create(),-e,e,-e,e,.1,pm(e)),c=E.multiply(E.create(),l,a),d=x.transformMat4(x.create(),[0,0,0],c),h=i/2,m=(Math.round(d[0]*h)-d[0]*h)/h,p=(Math.round(d[1]*h)-d[1]*h)/h;return E.multiply(E.create(),E.fromTranslation(E.create(),[m,p,0]),c)}u(mm,"directionalMatrix");function pm(t){return t*3}u(pm,"directionalDepthRange");function ja(t){return Math.min(170,t.coneAngles.outer*2+2)*(Math.PI/180)}u(ja,"spotFov");function fm(t){let r=t.transform.worldPosition,e=x.normalize(x.create(),t.toLightDirection),i=Math.abs(e[1])>.999?x.fromValues(0,0,1):x.fromValues(0,1,0),n=x.add(x.create(),r,e),o=E.perspective(E.create(),ja(t),1,.05,Math.max(.1,t.range));return E.multiply(E.create(),o,E.lookAt(E.create(),r,n,i))}u(fm,"spotMatrix");var vm=[{dir:[1,0,0],up:[0,-1,0]},{dir:[-1,0,0],up:[0,-1,0]},{dir:[0,1,0],up:[0,0,1]},{dir:[0,-1,0],up:[0,0,-1]},{dir:[0,0,1],up:[0,-1,0]},{dir:[0,0,-1],up:[0,-1,0]}];function gm(t){let r=t.transform.worldPosition,e=E.perspective(E.create(),Ya*(Math.PI/180),1,.05,Math.max(.1,t.range));return vm.map(({dir:i,up:n})=>{let o=x.add(x.create(),r,i);return E.multiply(E.create(),e,E.lookAt(E.create(),r,o,n))})}u(gm,"pointMatrices");var Uo={matrices:0,rects:4*Nt,params:5*Nt,extra:5*Nt+No,atlas:5*Nt+2*No,slots:5*Nt+2*No+1};function Ka(t,r,e,i=16){let n=t.atlasSize??Ut,o=Uo,s=e??new Float32Array(o.slots*4);return s.fill(0),t.views.forEach((a,l)=>{s.set(a.matrix,(o.matrices+l*4)*4);let c=1/n;s.set([a.rect.x*c,a.rect.y*c,a.rect.size*c,a.rect.size*c],(o.rects+l)*4)}),t.slots.forEach((a,l)=>{s.set([a.texelSize,a.perspective?1:0,0,a.firstView],(o.params+l)*4);let c=Math.min(1,Math.max(0,a.light.shadowStrength??1));s.set([c,Math.max(0,a.light.shadowDepthBias),Math.max(0,a.light.shadowNormalBias),0],(o.extra+l)*4)}),s.set([1/n,i,r?1:0,0],o.atlas*4),s}u(Ka,"packShadows");var xm=2,Oo=2,Or=7,Ot=class Ot{constructor(r){this.gl=r;this.name="ShadowAtlasPass";this.enabled=!0;this.uboData=new Float32Array(Uo.slots*4);this.filter=16;this.cacheViews=!0;this.stats={views:0,redrawn:0,draws:0};this.cache=[];this.casters=new Map;this.frame=0;this.planes=new Float32Array(24);this.bounds=Pr();this.modelLight=E.create();this.atlas=this.createAtlas(Ut),this.plain=Ot.casterProgram(r,[]),this.skinned=Ot.casterProgram(r,["SKINNED"]),this.ubo=r.createBuffer(),r.bindBuffer(r.UNIFORM_BUFFER,this.ubo),r.bufferData(r.UNIFORM_BUFFER,this.uboData.byteLength,r.DYNAMIC_DRAW),r.bindBuffer(r.UNIFORM_BUFFER,null)}get atlasTexture(){return this.atlas.depthTexture}get atlasSize(){return this.atlas.width}resetStats(){this.stats.views=this.stats.redrawn=this.stats.draws=0}invalidate(){this.cache=[]}render(r,e){let i=this.gl,n=this.enabled?r.views.slice(0,Nt):[];this.stats.views+=n.length,(r.atlasSize??Ut)!==this.atlas.width&&(this.atlas.dispose(),this.atlas=this.createAtlas(r.atlasSize),this.invalidate()),(!this.enabled||!this.cacheViews)&&this.invalidate();let o=this.casterChanges(e),s=n.map((a,l)=>this.isDirty(l,a.light,a.matrix,o));if(s.some(a=>a)){let a=i.isEnabled(i.CULL_FACE),l=i.getParameter(i.CULL_FACE_MODE);this.atlas.bind(),i.enable(i.SCISSOR_TEST),i.enable(i.DEPTH_TEST),i.depthFunc(i.LESS),i.depthMask(!0),i.enable(i.CULL_FACE),i.cullFace(i.FRONT),n.forEach((c,d)=>{if(!s[d])return;let{x:h,y:m,size:p}=c.rect;i.viewport(h,m,p,p),i.scissor(h,m,p,p),i.clear(i.DEPTH_BUFFER_BIT),Dr(c.matrix,this.planes);for(let v of e){let f=this.casters.get(v);f?.hasBounds&&!Br(this.planes,f.bounds.center,f.bounds.radius)||(this.drawDepth(v,c.matrix),this.stats.draws++)}this.cache[d]={light:c.light,matrix:Float32Array.from(c.matrix)},this.stats.redrawn++}),this.cache.length=n.length,i.disable(i.SCISSOR_TEST);for(let c of[this.plain,this.skinned])c.position>=0&&i.disableVertexAttribArray(c.position);i.cullFace(l),a||i.disable(i.CULL_FACE),i.bindFramebuffer(i.FRAMEBUFFER,null)}Ka({...r,views:n},this.enabled,this.uboData,this.filter),i.bindBuffer(i.UNIFORM_BUFFER,this.ubo),i.bufferSubData(i.UNIFORM_BUFFER,0,this.uboData),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,xm,this.ubo)}bindAtlas(){this.gl.activeTexture(this.gl.TEXTURE0+Oo),this.gl.bindTexture(this.gl.TEXTURE_2D,this.atlas.depthTexture),this.gl.activeTexture(this.gl.TEXTURE0)}casterChanges(r){let e=[],i=++this.frame;for(let n of r){let o=n.getBehaviour(_e),s=n.transform.modelMatrix,a=o?.deformationVersion??0,l=o?.shader?.buffers?.position??null,c=this.casters.get(n),d=!!c&&c.version===a&&c.buffer===l&&Qa(c.matrix,s);if(c&&d){c.seen=i;continue}c&&e.push(c.hasBounds?{center:Float32Array.from(c.bounds.center),radius:c.bounds.radius}:null),c??(c={matrix:new Float32Array(16),version:a,buffer:l,bounds:Pr(),hasBounds:!1,seen:i}),c.matrix.set(s),c.version=a,c.buffer=l,c.seen=i,c.hasBounds=!!o?.worldBounds(c.bounds),e.push(c.hasBounds?{center:Float32Array.from(c.bounds.center),radius:c.bounds.radius}:null),this.casters.set(n,c)}for(let[n,o]of this.casters)o.seen!==i&&(e.push(o.hasBounds?o.bounds:null),this.casters.delete(n));return e}isDirty(r,e,i,n){let o=this.cache[r];return!o||o.light!==e||!Qa(o.matrix,i)?!0:n.length?(Dr(i,this.planes),n.some(s=>!s||Br(this.planes,s.center,s.radius))):!1}createAtlas(r){let e=this.gl,i=new Ye(e,r,r,{color:null,depth:"texture"});return e.bindTexture(e.TEXTURE_2D,i.depthTexture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_FUNC,e.LEQUAL),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.bindTexture(e.TEXTURE_2D,null),i}dispose(){this.atlas.dispose(),this.gl.deleteProgram(this.plain.program),this.gl.deleteProgram(this.skinned.program),this.gl.deleteBuffer(this.ubo)}drawDepth(r,e){let i=this.gl,n=r.getBehaviour(_e),o=n?.shader,s=o?.buffers,a=n?.mesh?.meshData?.indices;if(!o||!s?.position||!s.indices||!a?.length)return;let l=n.jointTexture,c=l&&s.joints?this.skinned:this.plain;i.useProgram(c.program),E.multiply(this.modelLight,e,r.transform.modelMatrix),i.uniformMatrix4fv(c.matrix,!1,this.modelLight),i.bindVertexArray(null),i.bindBuffer(i.ARRAY_BUFFER,s.position),i.enableVertexAttribArray(c.position),i.vertexAttribPointer(c.position,3,i.FLOAT,!1,0,0),c===this.skinned&&(i.activeTexture(i.TEXTURE0+Or),i.bindTexture(i.TEXTURE_2D,l),i.uniform1i(c.jointTexture,Or),i.activeTexture(i.TEXTURE0),o.bindSkinAttributes(c.program)),i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,s.indices),i.drawElements(i.TRIANGLES,a.length,o.indexType,0),c===this.skinned&&Ot.disableSkinAttributes(i,c.program)}static casterProgram(r,e){let i=Ot.link(r,Ie.withDefines(vt[ne.vertex.shadow_caster],e),vt[ne.frag.depth_only]);return{program:i,position:r.getAttribLocation(i,"a_position"),matrix:r.getUniformLocation(i,"u_modelMatrix"),jointTexture:r.getUniformLocation(i,"u_jointTexture")}}static disableSkinAttributes(r,e){for(let i of["a_joints","a_weights"]){let n=r.getAttribLocation(e,i);n>=0&&r.disableVertexAttribArray(n)}}static link(r,e,i){let n=u((s,a)=>{let l=r.createShader(s);if(r.shaderSource(l,a),r.compileShader(l),!r.getShaderParameter(l,r.COMPILE_STATUS))throw new Error(`ShadowAtlasPass: ${r.getShaderInfoLog(l)}`);return l},"compile"),o=r.createProgram();if(r.attachShader(o,n(r.VERTEX_SHADER,e)),r.attachShader(o,n(r.FRAGMENT_SHADER,i)),r.linkProgram(o),!r.getProgramParameter(o,r.LINK_STATUS))throw new Error(`ShadowAtlasPass: ${r.getProgramInfoLog(o)}`);return o}};u(Ot,"ShadowAtlasPass");var cr=Ot;function Qa(t,r){for(let e=0;e<16;e++)if(t[e]!==r[e])return!1;return!0}u(Qa,"equal");var zo=class zo extends q{constructor(r){super("GeometryPass"),this.gl=r,this.ubo=new Pt(r)}initialize(){}execute(r,e){if(!e)return;let{frame:i}=e;this.ubo.update(i.camera.viewMatrix,i.camera.projectionMatrix);for(let n of i.opaque)n.draw();for(let n of i.skybox)n.draw();for(let n of i.transparent)n.draw()}cleanup(){}resize(r,e){}setGl(r){this.gl=r,this.ubo=new Pt(r)}toJsonObject(){return this.getBaseJsonInfo()}fromJson(r){super.fromJson(r)}};u(zo,"GeometryPass");var Pi=zo;var Vo=class Vo{constructor(){this.enabled=!0;this.program=null}setUniforms(r,e){}render(r){if(!r.source)return;let e=r.gl;this.program??(this.program=new or(e,this.fragUri)),r.target.bind(),this.program.use(),this.program.bindTexture("u_screenTexture",r.source.colorTexture,0),this.setUniforms(this.program,r),this.program.draw()}dispose(){this.program?.dispose(),this.program=null}};u(Vo,"PostEffect");var Go=Vo,Wo=class Wo extends Go{constructor(){super(...arguments);this.name="Retro";this.fragUri=ne.frag.retro;this.distortion=.15;this.aberration=.008}setUniforms(e,i){i.gl.uniform1f(e.uniform("u_time"),i.frame.time),i.gl.uniform1f(e.uniform("u_distortionStrength"),this.distortion),i.gl.uniform1f(e.uniform("u_aberrationSpread"),this.aberration)}};u(Wo,"RetroEffect");var Di=Wo;var Ho="";var Bi=class Bi extends q{constructor(){super("RenderPipelineSettings");this.shadowsEnabled=!0;this.shadowDistance=new j(60,5,500,1);this.hdr=!0;this.toneMapping=0;this.exposure=new j(1,0,8,.01);this.saturation=new j(1,0,2,.01);this.contrast=new j(1,.5,2,.01);this.retroEffect=!1;this.renderScale=new j(1,.25,2,.05);this.dynamicResolution=!1;this.targetFrameRate=new j(30,15,120,1);this.shadowMapSize=4096;this.shadowFilter=16;this.maxSpotShadows=new j(4,0,4,1);this.maxPointShadows=new j(2,0,2,1);this.cacheShadows=!0}applyQuality(e){let i={0:{scale:.5,dynamic:!0,atlas:1024,filter:4,spot:1,point:0},1:{scale:.75,dynamic:!0,atlas:2048,filter:4,spot:2,point:1},2:{scale:1,dynamic:!1,atlas:4096,filter:16,spot:4,point:2}},n=i[e]??i[2];this.renderScale.value=n.scale,this.dynamicResolution=n.dynamic,this.shadowMapSize=n.atlas,this.shadowFilter=n.filter,this.maxSpotShadows.value=n.spot,this.maxPointShadows.value=n.point,this.cacheShadows=!0}static suggestedQuality(e){if(typeof navigator>"u")return 2;let i=navigator,n=i.userAgentData?.mobile===!0||/Android|iPhone|iPad|iPod|Mobile/i.test(i.userAgent),o=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches&&!matchMedia("(any-pointer: fine)").matches;return n||o||Bi.isMobileGpu(e)?0:2}static isMobileGpu(e){if(!e)return!1;let i=e.getExtension("WEBGL_debug_renderer_info"),n=String(e.getParameter(i?i.UNMASKED_RENDERER_WEBGL:e.RENDERER)??"");return/Mali|Adreno|PowerVR|Apple GPU|Xclipse|Immortalis|Maleoon|VideoCore/i.test(n)}toJsonObject(){return this.serializeAutomatically()}fromJson(e){super.fromJson(e),this.deserializeAutomatically(e)}};u(Bi,"RenderPipelineSettings");var zr=Bi,Ii=class Ii extends q{constructor(e="Render Pipeline"){super("RenderPipeline");this.name=e;this.settings=new zr;this.lightsUbo=null;this._views=new Map;this._copy=null;this._passes=[];this._retro=new Di;this.effects=[this._retro];this._startTime=performance.now();this._dynamicFactor=1;this._lastFrame=0;this._frameTimes=[];this._lastAdjust=0;this._serializationIgnoreKeys.push("_gl","ubo","lightsUbo","scene","_shadowmapPass","_geometryPass","_views","_copy","_passes","_retro","effects","_startTime","_dynamicFactor","_lastFrame","_frameTimes","_lastAdjust")}static instanciate(){return new Ii}get shadowMap(){return this._shadowmapPass}get currentRenderScale(){let e=this.settings.renderScale.value;return this.settings.dynamicResolution?e*this._dynamicFactor:e}get sceneTarget(){return this._views.get(Ho)?.scene??null}setGlRenderingContext(e){this._gl=e,this.ubo=new Pt(e),this.lightsUbo?.dispose(),this.lightsUbo=new Mi(e),this._shadowmapPass?.dispose(),this._shadowmapPass=new cr(e),this._geometryPass??(this._geometryPass=new Pi(e)),this._geometryPass.setGl(e),this.applySettings(),this.disposeTargets(),this._copy?.dispose(),this._copy=new or(e,ne.frag.copy_with_depth);for(let i of this._passes)i.initialize(e)}initialize(e){this.scene=e}addPass(e){this._gl&&e.initialize(this._gl),this._passes.push(e)}draw(){let e=this._gl,i=oe.mainCamera;if(!this.scene||!e||!i||!this._copy)return;let n=Float32Array.from(e.getParameter(e.COLOR_CLEAR_VALUE)),o=performance.now(),s=(o-this._startTime)/1e3;this.applySettings(),this.adjustResolution(o),this._shadowmapPass.resetStats();let a=W.for(e);for(let c of this.textureCameras(i)){let d=a.getRenderTexture(c.targetTexture),h=Math.max(1,c.targetWidth|0),m=Math.max(1,c.targetHeight|0);c.aspectRatio=h/m,c.refreshMatrices(),oe.setMainCamera(c);try{let p=d.beginWrite(h,m);this.renderView(c,d.textureUri,h,m,n,s,p),d.endWrite()}finally{oe.setMainCamera(i)}}let l=this.currentRenderScale;this.renderView(i,Ho,e.drawingBufferWidth*l,e.drawingBufferHeight*l,n,s,null)}adjustResolution(e){let i=this._lastFrame?e-this._lastFrame:0;if(this._lastFrame=e,!this.settings.dynamicResolution){this._dynamicFactor=1,this._frameTimes.length=0;return}if(i>0&&i<250&&this._frameTimes.push(i),e-this._lastAdjust<1e3||this._frameTimes.length<10)return;let n=this._frameTimes.reduce((s,a)=>s+a,0)/this._frameTimes.length;this._frameTimes.length=0,this._lastAdjust=e;let o=1e3/Math.max(1,this.settings.targetFrameRate.value);n>o*1.1?this._dynamicFactor=Math.max(.5,this._dynamicFactor-.1):n<o*.8&&(this._dynamicFactor=Math.min(1,this._dynamicFactor+.05))}textureCameras(e){return this.scene.objects.filter(i=>i instanceof oe&&i!==e&&i.active&&!!i.targetTexture)}renderView(e,i,n,o,s,a,l){let c=this._gl,d=this.ensureView(i,n,o),h=d.scene;for(let b of this.scene.objects)b.transform.parent||b.transform.updateMatrices();let m=La(this.scene,e,a);for(let b of new Set([...m.opaque,...m.transparent,...m.shadowCasters]))b.getBehaviour(_e)?.beforeRender();let p={gl:c,frame:m,target:h},v=$a(m.lights,e.transform.worldPosition,{directionalDistance:this.settings.shadowDistance.value,atlasSize:this.settings.shadowMapSize,budget:{spot:this.settings.maxSpotShadows.value,point:this.settings.maxPointShadows.value}});this._shadowmapPass.render(v,m.shadowCasters),this._shadowmapPass.bindAtlas(),this.ubo.update(e.viewMatrix,e.projectionMatrix),this.lightsUbo.update(m.lights,v.slotOf),h.bind(),h.clear(s),c.enable(c.DEPTH_TEST),c.depthFunc(c.LESS),this._geometryPass.execute(this.scene,p);for(let b of this._passes)b.execute(this.scene,p);let f=h,g=this.effects.filter(b=>b.enabled);g.length&&this.withFullscreenState(()=>{for(let b of g){let T=this.postTarget(d,f===d.post[0]?1:0);b.render({...p,source:f,target:T}),f=T}}),this.copyTo(l,f,h)}resize(e,i){let n=this.currentRenderScale;e=Math.max(1,Math.floor(e*n)),i=Math.max(1,Math.floor(i*n));let o=this._views.get(Ho);o?.scene.resize(e,i);for(let s of o?.post??[])s.resize(e,i);for(let s of this._passes)s.resize(e,i)}destroy(){this.disposeTargets(),this._copy?.dispose(),this.lightsUbo?.dispose();for(let e of this.effects)e.dispose();this._shadowmapPass?.dispose();for(let e of this._passes)e.cleanup();this._copy=null}copyTo(e,i,n){let o=this._gl;e?e.bind():(o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight)),this.withFullscreenState(()=>{o.enable(o.DEPTH_TEST),o.depthFunc(o.ALWAYS),o.depthMask(!0);let s=this._copy;s.use(),s.bindTexture("u_color",i.colorTexture,0),s.bindTexture("u_depth",n.depthTexture,1),o.uniform1i(s.uniform("u_toneMapping"),this.settings.toneMapping),o.uniform1f(s.uniform("u_exposure"),this.settings.exposure.value),o.uniform1f(s.uniform("u_saturation"),this.settings.saturation.value),o.uniform1f(s.uniform("u_contrast"),this.settings.contrast.value),s.draw(),o.depthFunc(o.LESS)})}withFullscreenState(e){let i=this._gl,n=i.isEnabled(i.BLEND),o=i.isEnabled(i.CULL_FACE),s=i.isEnabled(i.DEPTH_TEST);i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),e(),i.bindTexture(i.TEXTURE_2D,null),i.activeTexture(i.TEXTURE0),n&&i.enable(i.BLEND),o&&i.enable(i.CULL_FACE),s?i.enable(i.DEPTH_TEST):i.disable(i.DEPTH_TEST)}colorFormat(){return this.settings.hdr&&Ye.supportsFloatColor(this._gl)?"rgba16f":"rgba8"}ensureView(e,i,n){let o=this._views.get(e);return o&&o.scene.color!==this.colorFormat()&&(this.disposeView(o),o=void 0),o||(o={scene:new Ye(this._gl,i,n,{color:this.colorFormat(),depth:"texture"}),post:[]},this._views.set(e,o)),o.scene.resize(i,n),o}postTarget(e,i){let n=e.scene,o=e.post[i];return(!o||o.color!==n.color)&&(o?.dispose(),o=e.post[i]=new Ye(this._gl,n.width,n.height,{color:n.color,depth:null})),o.resize(n.width,n.height),o}disposeView(e){e.scene.dispose();for(let i of e.post)i.dispose()}disposeTargets(){for(let e of this._views.values())this.disposeView(e);this._views.clear()}applySettings(){this._shadowmapPass&&(this._shadowmapPass.enabled=this.settings.shadowsEnabled,this._shadowmapPass.filter=this.settings.shadowFilter,this._shadowmapPass.cacheViews=this.settings.cacheShadows,this._retro.enabled=this.settings.retroEffect)}fromJson(e){super.fromJson(e),e.settings&&this.settings.fromJson(e.settings),this.applySettings()}toJsonObject(){return{...this.getBaseJsonInfo(),settings:this.settings.toJsonObject()}}};u(Ii,"RenderPipeline");var zt=Ii;z.addDependency("RenderPipeline",zt.instanciate,{name:"RenderPipeline",type:"RenderBehaviour",path:"Renderers/RenderPipeline",description:"Forward render pipeline: shadow map, scene into an off-screen target, copy to the canvas."});var wt=class wt{static get primary(){return this.active.values().next().value}static onDown(r){return this.downListeners.add(r),()=>this.downListeners.delete(r)}static onMove(r){return this.moveListeners.add(r),()=>this.moveListeners.delete(r)}static onUp(r){return this.upListeners.add(r),()=>this.upListeners.delete(r)}static velocity(r,e=100){let i=r.history;if(i.length<2)return{x:0,y:0};let n=i[i.length-1],o=i[i.length-2];for(let a=i.length-2;a>=0&&n.time-i[a].time<=e;a--)o=i[a];let s=(n.time-o.time)/1e3;return s<=0?{x:0,y:0}:{x:(n.x-o.x)/s,y:(n.y-o.y)/s}}static _down(r,e,i,n,o){let s={id:r,type:e,x:i,y:n,startX:i,startY:n,startTime:o,history:[{x:i,y:n,time:o}]};this.active.set(r,s);for(let a of this.downListeners)a(s)}static _move(r,e,i,n){let o=this.active.get(r);if(o){for(o.x=e,o.y=i,o.history.push({x:e,y:i,time:n});o.history.length>2&&n-o.history[0].time>this.historyMs;)o.history.shift();for(let s of this.moveListeners)s(o)}}static _up(r,e,i,n){let o=this.active.get(r);if(o){this._move(r,e,i,n),this.active.delete(r);for(let s of this.upListeners)s(o)}}};u(wt,"Pointer"),wt.historyMs=250,wt.active=new Map,wt.downListeners=new Set,wt.moveListeners=new Set,wt.upListeners=new Set;var Gt=wt;var Gr=class Gr extends q{constructor(e,i=new ze){super("SceneEntity");this.destroyed=!1;this.active=!0;this.show=!0;this.tag="Entity";this.updateInEditor=!1;this.behaviours=[];this.entityType=-1;this.name=e,this.transform=i,this.transform.parentEntity=this}get type(){return this.constructor.name}static get className(){return"SceneEntity"}static instanciate(e="Entity",i){return(!i||!(i instanceof ze))&&(i=new ze),new Gr(e,i)}initialize(){for(let e of this.behaviours)e.initialize();this.destroyed=!1,this.update(0)}update(e){if(this.active){this.transform.updateMatrices();for(let i of this.behaviours.filter(n=>n.active))i.update(e)}}draw(){if(this.active)for(let e of this.behaviours.filter(i=>i.active))e.draw()}destroy(){for(let e of this.behaviours)e.destroy();this.destroyed=!0}addBehaviour(e){e.parent=this,e.initialize(),this.behaviours.push(e)}removeBehaviour(e){let i=this.behaviours.indexOf(e);i>=0&&this.behaviours.splice(i,1)[0]?.destroy()}getBehaviours(e){return this.behaviours.filter(i=>i instanceof e)}getBehaviour(e){return this.behaviours.find(i=>i instanceof e)}fromJson(e){super.fromJson(e),this.deserializeAutomatically(e)}toJsonObject(){let e=this.serializeAutomatically();return e.behaviours=this.behaviours.map(i=>i.toJsonObject()),console.debug("Serialized behaviour",e),e}clone(){let e=Gr.instanciate(this.name,this.transform);return e.fromJson(this.toJsonObject()),e}};u(Gr,"SceneEntity");var xe=Gr;var ki=class ki extends xe{constructor(e){super(e);this._className="Light";this.entityType=0;this.castShadows=!1;this.shadowDepthBias=.5;this.shadowNormalBias=1;this.shadowStrength=.75;this.color=new y(.2,.2,.2,1),this.entityType=0}static instanciate(e,i){return new ki(e||"Light")}};u(ki,"Light");var Xe=ki;var Fi=class Fi extends Xe{constructor(e){super(e);this._className="DirectionalLight";this.entityType=1;this.invertLightDirection=!1;this.entityType=1,this.color=new y(1,.98,.95,.7),this.castShadows=!0}static get className(){return"DirectionalLight"}get direction(){return x.normalize(x.create(),this.invertLightDirection?this.transform.back:this.transform.forward)}static instanciate(e,i){return new Fi(e||"Directional Light")}};u(Fi,"DirectionalLight");var Tt=Fi;var Jo=class Jo extends q{constructor(){super("LightAttenuation");this.constant=.2;this.linear=.01;this.quadratic=.001}toJsonObject(){return this.serializeAutomatically()}fromJson(e){super.fromJson(e),this.deserializeAutomatically(e)}};u(Jo,"LightAttenuation");var ur=Jo;var qo=class qo extends q{constructor(){super("LightConeAngles");this.inner=20;this.outer=30}toJsonObject(){return this.serializeAutomatically()}fromJson(e){super.fromJson(e),this.deserializeAutomatically(e)}};u(qo,"LightConeAngles");var Ni=qo;var Oi=class Oi extends Xe{constructor(e){super(e);this._className="PointLight";this.entityType=2;this.range=25;this.entityType=2,this.color=new y(1,.85,.57,1),this.attenuation=new ur}static get className(){return"PointLight"}toJsonObject(){return this.serializeAutomatically()}fromJson(e){super.fromJson(e),this.deserializeAutomatically(e)}static instanciate(e,i){return new Oi(e||"Light")}};u(Oi,"PointLight");var Ui=Oi;var Gi=class Gi extends Xe{constructor(e){super(e);this._className="SpotLight";this.entityType=3;this.coneAngles=new Ni;this.attenuation=new ur;this.range=25;this.entityType=3,this.color=new y(1,.96,.89,1)}get toLightDirection(){return this.transform.forward}toJsonObject(){return this.serializeAutomatically()}fromJson(e){super.fromJson(e),this.deserializeAutomatically(e)}static instanciate(e,i){return new Gi(e||"Light")}};u(Gi,"SpotLight");var zi=Gi;var Vi=class Vi extends xe{constructor(){super("Camera");this._className="Camera";this.cameraType=0;this.orthoSize=10;this.fieldOfView=45;this.nearPlane=.01;this.farPlane=2e3;this.aspectRatio=1;this.targetTexture="";this.targetWidth=512;this.targetHeight=512;this.tag="Camera";this.entityType=4,this._projectionMatrix=E.create(),this._viewMatrix=E.create()}static get mainCamera(){return this._mainCamera}get projectionMatrix(){return this._projectionMatrix}get viewMatrix(){return this._viewMatrix}static setMainCamera(e){this._mainCamera=e}initialize(){this.updateProjectionMatrix(),this.updateViewMatrix(),super.initialize()}updateProjectionMatrix(){if(this.cameraType===0)E.perspective(this._projectionMatrix,this.fieldOfView*Math.PI/180,this.aspectRatio,this.nearPlane,this.farPlane);else{let e=-this.orthoSize*this.aspectRatio,i=this.orthoSize*this.aspectRatio,n=-this.orthoSize,o=this.orthoSize;E.ortho(this._projectionMatrix,e,i,n,o,-this.farPlane,this.farPlane)}}refreshMatrices(){this.updateProjectionMatrix(),this.updateViewMatrix()}updateViewMatrix(){let e=this.transform.worldPosition,i=x.add(x.create(),e,this.transform.forward),n=this.transform.up;E.lookAt(this._viewMatrix,e,i,n)}update(e){this.updateViewMatrix(),super.update(e)}worldToScreenPosition(e,i,n){let o=E.create();E.multiply(o,this._projectionMatrix,this._viewMatrix);let s=fe.fromValues(e[0],e[1],e[2],1);if(fe.transformMat4(s,s,o),s[3]===0)return ce.fromValues(0,0);let a=x.fromValues(s[0]/s[3],s[1]/s[3],s[2]/s[3]),l=(a[0]*.5+.5)*i,c=(a[1]*-.5+.5)*n;return ce.fromValues(l,c)}screenToWorldRay(e,i,n){let o=2*e[0]/i-1,s=1-2*e[1]/n,a=E.create();E.multiply(a,this._projectionMatrix,this._viewMatrix);let l=E.create();E.invert(l,a);let c=fe.fromValues(o,s,-1,1),d=fe.fromValues(o,s,1,1),h=fe.create();fe.transformMat4(h,c,l);let m=fe.create();if(fe.transformMat4(m,d,l),h[3]===0||m[3]===0)return{origin:x.fromValues(0,0,0),direction:x.fromValues(0,0,0)};let p=x.fromValues(h[0]/h[3],h[1]/h[3],h[2]/h[3]),v=x.fromValues(m[0]/m[3],m[1]/m[3],m[2]/m[3]),f=x.create();return x.subtract(f,v,p),x.normalize(f,f),{origin:p,direction:f}}screenToWorldPosition(e,i,n,o){let{origin:s,direction:a}=this.screenToWorldRay(e,n,o),l=x.create();return x.scaleAndAdd(l,s,a,i),l}worldToClipPosition(e){let i=E.create();E.multiply(i,this._projectionMatrix,this._viewMatrix);let n=fe.fromValues(e[0],e[1],e[2],1);return fe.transformMat4(n,n,i),n}toJsonObject(){return{...super.toJsonObject(),cameraType:this.cameraType,orthoSize:this.orthoSize,fieldOfView:this.fieldOfView,nearPlane:this.nearPlane,farPlane:this.farPlane,aspectRatio:this.aspectRatio,targetTexture:this.targetTexture,targetWidth:this.targetWidth,targetHeight:this.targetHeight}}fromJson(e){super.fromJson(e),e.cameraType!==void 0&&(this.cameraType=e.cameraType),e.orthoSize!==void 0&&(this.orthoSize=e.orthoSize),e.fieldOfView!==void 0&&(this.fieldOfView=e.fieldOfView),e.nearPlane!==void 0&&(this.nearPlane=e.nearPlane),e.farPlane!==void 0&&(this.farPlane=e.farPlane),e.aspectRatio!==void 0&&(this.aspectRatio=e.aspectRatio),e.targetTexture!==void 0&&(this.targetTexture=e.targetTexture),e.targetWidth!==void 0&&(this.targetWidth=e.targetWidth),e.targetHeight!==void 0&&(this.targetHeight=e.targetHeight)}static instanciate(e,i){let n=new Vi;return n.name=e||n.name,n.transform=i||n.transform,n}};u(Vi,"Camera");var oe=Vi;var Yo=class Yo extends xe{constructor(){super("Scene");this._className="Scene";this.isRunning=!1;this.inEditMode=!1;this.clearColor=tr.aliceBlue;this.tag="Scene";this.entityType=5;this.ellapsedTime=0;this.resourceHandles=[];this._objects=[],this.behaviours=[],this.sceneFog=new yi,this._renderPipeline=new zt,this._renderPipeline.initialize(this)}get shadowmap(){return this._renderPipeline.shadowMap}get renderPipeline(){return this._renderPipeline}get objects(){return this._objects}get lights(){return this._objects.filter(e=>e instanceof Xe)}initialize(){for(let e of this.objects)e.initialize();super.initialize()}update(e){if(!this.destroyed&&(oe.mainCamera&&oe.mainCamera.update(e),this.behaviours.forEach(i=>i.beforeUpdate(e)),!this.isRunning&&this.inEditMode&&this.objects?.length&&(this.objects.filter(n=>n.updateInEditor).forEach(n=>n.update(e)),this.behaviours.forEach(n=>n.update(e))),!!this.isRunning)){this.ellapsedTime+=e;for(let i of this.objects.filter(n=>n.active))i.update(e);this.behaviours.forEach(i=>i.afterUpdate())}}draw(){this.destroyed||!this.gl||!oe.mainCamera||this._renderPipeline.draw()}addEntity(e){this.destroyed||(e.scene=this,this._objects.push(e),e.initialize())}removeEntity(e){if(this.destroyed)return;let i=this._objects.indexOf(e);i!==-1&&(this._objects.splice(i,1),e.destroy())}addBehaviour(e){e.parent=this,this.behaviours.push(e),e.initialize()}setGlRenderingContext(e){this.gl=e,this.behaviours.forEach(i=>{i.setGl&&i.setGl(e)}),this._renderPipeline.setGlRenderingContext(e)}holdResource(e){this.resourceHandles.push(e)}destroy(){for(let e of this.objects)e.destroy();this._objects=[];for(let e of this.resourceHandles)e.release();this.resourceHandles=[],this._renderPipeline.destroy(),super.destroy()}fromJson(e){if(super.fromJson(e),e.renderPipeline){let i=z.instanciateObjectFromJsonData(e.renderPipeline.className);this._renderPipeline=i||new zt,this._renderPipeline.fromJson(e.renderPipeline)}else this._renderPipeline=new zt;this._renderPipeline.initialize(this),this.sceneFog.fromJson(e);for(let i of e.objects)this.addEntity(i)}toJsonObject(){let e={},i={},n=this.objects.filter(o=>o.getBehaviours(_e)).map(o=>o.getBehaviour(_e));for(let o of n)if(o){if(o.shader?.material)for(let s of Object.keys(o.shader.material)){let a=o.shader.material[s];a instanceof sr?i[a.textureUris?.join("|")||a.name]=a.toJsonObject():a instanceof qe&&(i[a.textureUri||a.name]=a.toJsonObject())}o.serializesMesh&&(o.mesh?e[o.mesh.meshData.uuid]=o.mesh.meshData.toJsonObject():console.debug("No mesh for renderer",o))}return{...this.getBaseJsonInfo(),renderPipeline:this._renderPipeline.toJsonObject(),sceneFog:this.sceneFog.toJsonObject(),objects:this.objects.map(o=>o.toJsonObject()),meshMaps:e,textureMaps:i}}getEntitieByName(e){return this.objects.find(i=>i.name===e)}getEntitieClassByName(e){return this.objects.find(i=>i.className===e)}getEntitiesClassByName(e){return this.objects.filter(i=>i.className===e)}getEntitieByUuid(e){return this.objects.find(i=>i.uuid===e)}getEntitiesByTag(e){return this.objects.filter(i=>i.tag===e)}getEntities(e){return this._objects.filter(i=>i instanceof e)}};u(Yo,"Scene");var dr=Yo;var Wi=class Wi extends q{constructor(){super("EntityBehaviour");this.active=!0;this.renderLayer=2;this._initialized=!1;this._uuid=Ze(),this._serializationIgnoreKeys.push("parent","_initialized","_serializationIgnoreKeys")}static instanciate(e){return new Wi}get transform(){return this.parent?.transform}initialize(){return this._initialized=!0}update(e){}updateEditor(e){}draw(){}destroy(){}toJsonObject(){return{...super.toJsonObject(),active:this.active,uuid:this.uuid}}fromJson(e){super.fromJson(e),this.active=e.active,this._uuid=e.uuid}clone(){return null}};u(Wi,"EntityBehaviour");var me=Wi;var Hi=class Hi extends me{constructor(e){super();this._gl=e;this._framebuffer=null;this._depthRenderbuffer=null;this._className="RendererBehaviour";this.drawPrimitiveType=1;this._time=0;this._worldMatrixUniformLocation=null;this._worldInverseTransposeMatrixUniformLocation=null;this.enableCullFace=!0;this.enableDephTest=!0;this.enableBlend=!0;this.writeToDephBuffer=!0;this.cullFace=ho.BACK;this.dephMode=mo.Less;this.faceWinding=po.CounterClockwise;this.blendMode={sourcefactor:co.SRC_ALPHA,destfactor:uo.ONE_MINUS_SRC_ALPHA};this.renderLayer=2;this.castShadows=!0;this.mesh=new Xt}static instanciate(e){return new Hi(e)}initialize(){return this._initialized||!this._gl?!1:(this.setGlSettings(),this.initializeShader(),super.initialize())}setGlSettings(){this._gl&&(this.enableDephTest?(this._gl.enable(this._gl.DEPTH_TEST),this._gl.depthFunc(this.dephMode)):this._gl.disable(this._gl.DEPTH_TEST),this.enableBlend?(this._gl.enable(this._gl.BLEND),this._gl.blendFunc(this.blendMode.sourcefactor,this.blendMode.destfactor)):this._gl.disable(this._gl.BLEND),this.enableCullFace?(this._gl.enable(this._gl.CULL_FACE),this._gl.cullFace(this.cullFace)):this._gl.disable(this._gl.CULL_FACE),this._gl.depthMask(this.writeToDephBuffer),this._gl.frontFace(this.faceWinding))}initializeShader(){this.shader&&(this.shader.initialize(),this.shader.buffers.position=this._gl.createBuffer(),this.shader.buffers.uv=this._gl.createBuffer(),this.shader.buffers.indices=this._gl.createBuffer())}setCameraMatrices(){if(this.shader){let e=oe.mainCamera,i=E.create();this.parent.transform.updateMatrices(),E.multiply(i,e.projectionMatrix,e.viewMatrix),E.multiply(i,i,this.parent.transform.modelMatrix),this.shader.setMat4("u_mvpMatrix",i)}}setModelWorldMatrices(){if(this._worldMatrixUniformLocation&&this._gl.uniformMatrix4fv(this._worldMatrixUniformLocation,!1,new Float32Array(this.parent.transform.modelMatrix)),this._worldInverseTransposeMatrixUniformLocation){let e=E.create();E.invert(e,this.parent.transform.modelMatrix),E.transpose(e,e);let i=Zt.create();Zt.fromMat4(i,e),this._gl.uniformMatrix3fv(this._worldInverseTransposeMatrixUniformLocation,!1,new Float32Array(i))}}setShaderVariables(){this.setGlSettings(),this.setCameraMatrices(),this.setModelWorldMatrices(),this.shader&&(this.shader.setFloat("u_time",this._time),this.shader.setVec2("u_screenResolution",[Je.rendererWidth,Je.rendererHeight]),this.shader.loadDataIntoShader())}setRenderTarget(e,i,n){if(!this._gl)return;this._framebuffer||(this._framebuffer=this._gl.createFramebuffer()),this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,this._framebuffer),this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER,this._gl.COLOR_ATTACHMENT0,this._gl.TEXTURE_2D,e,0),this._depthRenderbuffer||(this._depthRenderbuffer=this._gl.createRenderbuffer()),this._gl.bindRenderbuffer(this._gl.RENDERBUFFER,this._depthRenderbuffer),this._gl.renderbufferStorage(this._gl.RENDERBUFFER,this._gl.DEPTH_COMPONENT16,i,n),this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER,this._gl.DEPTH_ATTACHMENT,this._gl.RENDERBUFFER,this._depthRenderbuffer);let o=this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER);o!==this._gl.FRAMEBUFFER_COMPLETE&&console.error("Framebuffer not complete!",o),this._gl.viewport(0,0,i,n)}clearRenderTarget(){this._gl&&(this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,null),this._gl.viewport(0,0,Je.rendererWidth,Je.rendererHeight))}startPass(e,i,n,o=[0,0,0,0]){this.setRenderTarget(e,i,n),this._gl.clearColor(o[0],o[1],o[2],o[3]),this._gl.clear(this._gl.COLOR_BUFFER_BIT|this._gl.DEPTH_BUFFER_BIT)}endPass(){this.clearRenderTarget()}toJsonObject(){return{...super.toJsonObject(),shader:this.shader?.toJsonObject(),mesh:this.mesh.toJsonObject()}}fromJson(e){super.fromJson(e);let i=e.shader.material,n=z.instanciateObjectFromJsonData(i.className);n.fromJson(i),this.shader=z.instanciateObjectFromJsonData(e.shader.className,[this._gl,n]),this.shader?.fromJson(e.shader),e.mesh&&this.mesh.fromJson(e.mesh)}drawPoint(e,i=10,n=this.shader){if(!this._gl||!n||!n.buffers.position||!n._shaderProgram){console.warn("Renderer is not fully initialized. Cannot draw point.");return}this.drawPrimitiveType=0,n.use(),this.setShaderVariables(),n.setFloat("u_pointSize",i),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,n.buffers.position),this._gl.bufferData(this._gl.ARRAY_BUFFER,new Float32Array(e.vector),this._gl.STATIC_DRAW);let o=this._gl.getAttribLocation(n._shaderProgram,"a_position");this._gl.enableVertexAttribArray(o),this._gl.vertexAttribPointer(o,3,this._gl.FLOAT,!1,0,0),this._gl.drawArrays(this._gl.POINTS,0,1),this._gl.disableVertexAttribArray(o),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,null),n.release()}drawLine(e,i){if(!this._gl||!this.shader||!this.shader.buffers.position){console.warn("Renderer is not fully initialized. Cannot draw line.");return}let n=[...e.vector,...i.vector];this.drawPrimitiveType=1,this.shader.use(),this.setShaderVariables(),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,this.shader.buffers.position),this._gl.bufferData(this._gl.ARRAY_BUFFER,new Float32Array(n),this._gl.STATIC_DRAW);let o=this._gl.getAttribLocation(this.shader._shaderProgram,"a_position");this._gl.enableVertexAttribArray(o),this._gl.vertexAttribPointer(o,3,this._gl.FLOAT,!1,0,0),this._gl.drawArrays(this._gl.LINES,0,2),this._gl.disableVertexAttribArray(o),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,null),this.shader.release()}draw(){!this.mesh||!this.shader?._shaderProgram||(this.shader.use(),this.shader.bindBuffers(),this._gl.drawElements(this.drawPrimitiveType,this.mesh.meshData.indices.length,this.shader.indexType,0),this.shader.release())}beforeRender(){}worldBounds(e){let i=Ea(this.mesh?.meshData);return!i||!this.parent?!1:(Aa(e,i,this.parent.transform.modelMatrix),!0)}get deformationVersion(){return 0}get serializesMesh(){return!0}get jointTexture(){return null}update(e){super.update(e),this._time+=e}setGl(e){this._gl=e}};u(Hi,"RendererBehaviour");var _e=Hi;var qi=class qi extends Ie{constructor(e,i){super(e,i,ne.frag.default_unlit,ne.vertex.default);this.gl=e;this.material=i;this._className="UnlitShader"}static instanciate(e,i){return new qi(e,i)}async loadDataIntoShader(){this.material&&(super.loadDataIntoShader(),await this.checkAndLoadTextures(),this.setVec4("u_matColor",this.material.color.toVec4()),this.setVec2("u_uvScale",this.material.uvScale.vector),this.setVec2("u_uvOffset",this.material.uvOffset.vector),this.material.mainTex&&this.material.mainTex.isImageLoaded&&(this.setTexture("u_mainTex",this.material.mainTex,0),this.material.mainTex.bind()))}async checkAndLoadTextures(){this.material.mainTex&&(this.material.mainTex.isImageLoaded?(this.setTexture("u_mainTex",this.material.mainTex,0),this.material.mainTex.bind()):(this.material.mainTex.setGL(this.gl),await this.material.mainTex.load()))}release(){this.material?.mainTex&&this.material.mainTex.unBind()}};u(qi,"UnlitShader");var Ji=qi;var Yi=class Yi extends Ie{constructor(e,i){super(e,i,ne.frag.default_lit,ne.vertex.default);this.gl=e;this.material=i;this._className="LitShader";this._emissiveMapUniformLocation=null;this._tangentAttributeLocation=-1;this._bitangentAttributeLocation=-1;this._defaultTextures={}}static instanciate(e,i){return new Yi(e,i)}loadDataIntoShader(){this.material&&(this.checkAndLoadTextures(),super.loadDataIntoShader(),this.setVec4("u_matColor",this.material.color.toVec4()),this.setVec2("u_uvScale",this.material.uvScale.vector),this.setVec2("u_uvOffset",this.material.uvOffset.vector),this.setFloat("u_specularStrength",this.material.specularStrength),this.setFloat("u_roughness",Math.max(this.material.roughness,.01)),this.setFloat("u_normalMapStrength",this.material.normalMapStrength),this.setVec3("u_cameraPosition",oe.mainCamera.transform.worldPosition))}async checkAndLoadTextures(){let e=u(async(i,n,o,s)=>{let a=i;if((!a||!a.isImageLoaded)&&(a&&!a.isImageLoaded&&(a.setGL(this.gl),a.load()),a=await s(this.gl)),this._shaderProgram&&a){let l=this.gl.getUniformLocation(this._shaderProgram,n);l!==null&&(this.gl.activeTexture(this.gl.TEXTURE0+o),a.glTexture?this.gl.bindTexture(this.gl.TEXTURE_2D,a.glTexture):a.bind(),this.gl.uniform1i(l,o))}return a},"bindMap");this.material.mainTex=await e(this.material.mainTex,"u_mainTex",0,i=>W.for(i).getTexture(Me.white)),this.material.normalTex=await e(this.material.normalTex,"u_normalMap",1,i=>W.for(i).getTexture(Me.normal)),this.material.specularTex=await e(this.material.specularTex,"u_specularMap",3,i=>W.for(i).getTexture(Me.white)),this.material.roughnessTex=await e(this.material.roughnessTex,"u_roughnessMap",4,i=>W.for(i).getTexture(Me.white)),this.material.aoTex=await e(this.material.aoTex,"u_aoMap",5,i=>W.for(i).getTexture(Me.white)),this.material.emissiveTex=await e(this.material.emissiveTex,"u_emissiveMap",6,i=>W.for(i).getTexture(Me.black))}release(){super.release(),this.material.mainTex&&this.material.mainTex.unBind(),this.material.normalTex&&this.material.normalTex.unBind(),this.material.specularTex&&this.material.specularTex.unBind(),this.material.roughnessTex&&this.material.roughnessTex.unBind(),this.material.aoTex&&this.material.aoTex.unBind(),this.material.emissiveTex&&this.material.emissiveTex.unBind()}toJsonObject(){return{...super.toJsonObject(),mainTex:this.material.mainTex?.toJsonObject(),normalTex:this.material.normalTex?.toJsonObject(),specularTex:this.material.specularTex?.toJsonObject(),roughnessTex:this.material.roughnessTex?.toJsonObject(),aoTex:this.material.aoTex?.toJsonObject(),emissiveTex:this.material.emissiveTex?.toJsonObject()}}async fromJson(e){await super.fromJson(e),this.material.fromJson(e.material)}destroy(){super.destroy(),this.material.mainTex&&this.material.mainTex.destroy(),this.material.normalTex&&this.material.normalTex.destroy(),this.material.specularTex&&this.material.specularTex.destroy(),this.material.roughnessTex&&this.material.roughnessTex.destroy(),this.material.aoTex&&this.material.aoTex.destroy(),this.material.emissiveTex&&this.material.emissiveTex.destroy()}};u(Yi,"LitShader");var at=Yi;var $i=class $i extends Ie{constructor(){super(...arguments);this._className="SkyboxShader";this.sun={useSun:!1,sunDirection:new Be(0,.3,-10),sunColor:new y(1,1,1,1),sunSize:.999,sunFalloff:.03};this.moon={useMoon:!1,moonDirection:new Be(0,-1,0),moonColor:new y(.8,.9,1,1),moonSize:.998,moonFalloff:.002,moonPhase:0,moonEarthshine:.02,moonTerminatorSoftness:.5,moonEnableRotation:1,moonRotationSpeed:.05};this.clouds={useClouds:!1,cloudSpeed:.1,cloudRepetition:0,cloudTiling:.4,cloudSeed:10,cloudSparsity:.01,wheatherCondition:.4};this.stars={useStars:!1,starIntensity:3,starScale:200,starSparsity:34,starSpeed:.004}}static instanciate(e,i){return new $i(e,i)}initialize(){return this.fragUri=ne.frag.skybox,this.vertexUri=ne.vertex.skybox,super.initialize()}async loadDataIntoShader(){this.material&&(this.use(),this.material.mainTex&&(this.material.mainTex.isImageLoaded?(this.setTexture("u_mainTex",this.material.mainTex,0),this.material.mainTex.bind()):(this.material.mainTex.setGL(this.gl),await this.material.mainTex.load())),super.loadDataIntoShader(),this.setVec3("u_sunDirection",this.sun.sunDirection.vector),this.setVec4("u_sunColor",this.sun.sunColor.toVec4()),this.setFloat("u_sunSize",this.sun.sunSize),this.setFloat("u_sunFalloff",this.sun.sunFalloff),this.setInt("u_useSun",this.sun.useSun?1:0),this.setVec3("u_moonDirection",this.moon.moonDirection.vector),this.setVec4("u_moonColor",this.moon.moonColor.toVec4()),this.setFloat("u_moonSize",this.moon.moonSize),this.setFloat("u_moonFalloff",this.moon.moonFalloff),this.setFloat("u_moonPhase",this.moon.moonPhase),this.setFloat("u_moonEarthshine",this.moon.moonEarthshine),this.setFloat("u_moonTerminatorSoftness",this.moon.moonTerminatorSoftness),this.setInt("u_moonEnableRotation",this.moon.moonEnableRotation),this.setFloat("u_moonRotationSpeed",this.moon.moonRotationSpeed),this.setInt("u_useMoon",this.moon.useMoon?1:0),this.setVec4("u_skyColor",this.material.skyColor.toVec4()),this.setVec4("u_horizonColor",this.material.horizonColor.toVec4()),this.setVec4("u_groundColor",this.material.groundColor.toVec4()),this.setFloat("u_exponent",this.material.exponent),this.setInt("u_cloudRepetition",this.clouds.cloudRepetition),this.setFloat("u_cloudSpeed",this.clouds.cloudSpeed),this.setFloat("u_cloudTiling",this.clouds.cloudTiling),this.setFloat("u_cloudSeed",this.clouds.cloudSeed),this.setInt("u_useClouds",this.clouds.useClouds?1:0),this.setFloat("u_weatherCondition",this.clouds.wheatherCondition),this.setFloat("u_cloudSparsity",this.clouds.cloudSparsity),this.setInt("u_useStars",this.stars.useStars?1:0),this.setFloat("u_starIntensity",this.stars.starIntensity),this.setFloat("u_starScale",this.stars.starScale),this.setFloat("u_starSparsity",this.stars.starSparsity),this.setFloat("u_starSpeed",this.stars.starSpeed),this.release())}setTexture(e,i,n){let o=this.gl.getUniformLocation(this._shaderProgram,e);o&&(this.gl.activeTexture(this.gl.TEXTURE0+n),i.bind(),this.gl.uniform1i(o,n))}release(){this.material.mainTex?.unBind()}};u($i,"SkyboxShader");var Mt=$i;var ji=class ji extends _e{constructor(e){super(e);this._gl=e;this._className="MeshRendererBehaviour";this._normalMapUniformLocation=null;this._specularMapUniformLocation=null;this._roughnessMapUniformLocation=null;this._aoMapUniformLocation=null;this._emissiveMapUniformLocation=null;this._tangentAttributeLocation=-1;this._bitangentAttributeLocation=-1;this._defaultTextures={};this.receiveShadows=!0;this.drawPrimitiveType=4}static instanciate(e){return new ji(e)}get fog(){return this.parent.scene.sceneFog}draw(){if(!this.mesh||!this.shader?._shaderProgram)return;this.shader.use(),this.shader instanceof at&&(this.shader.setInt("u_receiveShadows",this.receiveShadows?1:0),this.shader.setInt("u_shadowAtlasMap",Oo),this.setShaderVariables());let e=oe.mainCamera.viewMatrix;this.shader.setMat4("u_viewMatrix",e),this.shader.setInt("u_fogEnabled",this.fog.enabled?1:0),this.fog.enabled&&(this.shader.setVec3("u_FogColor",this.fog.color.toVec3()),this.shader.setFloat("u_FogDensity",this.fog.density),this.shader.setFloat("u_fogDistance",this.fog.distance),this.shader.setInt("u_fogType",this.fog.fogType),this.shader.setFloat("u_FogHeightFalloff",this.fog.heightFalloff),this.shader.setFloat("u_FogBaseHeight",this.fog.baseHeight)),super.setShaderVariables(),super.draw()}initializeShader(){super.initializeShader(),this.shader&&(this.shader.buffers.normal=this._gl.createBuffer(),this.shader.buffers.tangent=this._gl.createBuffer(),this.shader.buffers.bitangent=this._gl.createBuffer(),this.shader.initBuffers(this._gl,this.mesh.meshData))}setShaderVariables(){this.setNormalMapsInformation()}getNormalMapLocations(){this.shader?._shaderProgram&&(this._normalMapUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_normalMap"),this._specularMapUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_specularMap"),this._roughnessMapUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_roughnessMap"),this._aoMapUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_aoMap"),this._emissiveMapUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_emissiveMap"),this._worldMatrixUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_worldMatrix"),this._worldInverseTransposeMatrixUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_worldInverseTransposeMatrix"),this._tangentAttributeLocation=this._gl.getAttribLocation(this.shader._shaderProgram,"a_tangent"),this._bitangentAttributeLocation=this._gl.getAttribLocation(this.shader._shaderProgram,"a_bitangent"))}getDefaultTexture(e){if(this._defaultTextures[e])return this._defaultTextures[e];let i=this._gl.createTexture();this._gl.bindTexture(this._gl.TEXTURE_2D,i);let n;return e==="white"?n=new Uint8Array([255,255,255,255]):e==="black"?n=new Uint8Array([0,0,0,255]):n=new Uint8Array([128,128,255,255]),this._gl.texImage2D(this._gl.TEXTURE_2D,0,this._gl.RGBA,1,1,0,this._gl.RGBA,this._gl.UNSIGNED_BYTE,n),this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_MIN_FILTER,this._gl.NEAREST),this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_MAG_FILTER,this._gl.NEAREST),this._defaultTextures[e]=i,i}bindMap(e,i,n,o){if(!i)return;let s;e&&e.glTexture?s=e.glTexture:s=this.getDefaultTexture(o),this._gl.activeTexture(this._gl.TEXTURE0+n),this._gl.bindTexture(this._gl.TEXTURE_2D,s),this._gl.uniform1i(i,n)}setNormalMapsInformation(){if(!this.shader)return;this.getNormalMapLocations();let e=this.shader.material;this.bindMap(e.normalTex,this._normalMapUniformLocation,1,"normal"),this.bindMap(e.specularTex,this._specularMapUniformLocation,3,"white"),this.bindMap(e.roughnessTex,this._roughnessMapUniformLocation,4,"white"),this.bindMap(e.aoTex,this._aoMapUniformLocation,5,"white"),this.bindMap(e.emissiveTex,this._emissiveMapUniformLocation,6,"black")}};u(ji,"MeshRendererBehaviour");var Ve=ji;var Vr=class Vr extends Ve{constructor(e){super(e);this._className="SkinnedMeshRendererBehaviour";this.meshUri="";this.skinUri="";this.boneIds=[];this.bones=[];this.inverseBindMatrices=[];this._jointTexture=null;this.jointData=new Float32Array(0);this.loaded=!1;this.loading=null;this.scratch=E.create();this.meshInverse=E.create();this.jointReach=new Float32Array(0);this._deformationVersion=0;this._serializationIgnoreKeys.push("bones","inverseBindMatrices","_jointTexture","jointData","loaded","loading","scratch","meshInverse","jointReach","_deformationVersion")}static instanciate(e){return new Vr(e)}get jointTexture(){return this.loaded?this._jointTexture:null}get serializesMesh(){return!1}whenLoaded(){return this.loading??Promise.resolve()}initializeShader(){this.shader&&(this.shader.defines.includes("SKINNED")||this.shader.defines.push("SKINNED"),this.shader.initialize(),this.loading=this.load().catch(e=>console.error(`SkinnedMeshRenderer: cannot load ${this.meshUri}`,e)))}async load(){let e=bt(this.meshUri);if(!e||e.kind!=="mesh")throw new Error(`meshUri "${this.meshUri}" is not <model>#mesh/<n>`);let i=await W.for(this._gl).getModel(e.modelUri),n=i.meshes[e.index];if(!n)throw new Error(`${this.meshUri}: the model has no mesh ${e.index}`);let o=bt(this.skinUri),s=o?.kind==="skin"?i.skins[o.index]:void 0;this.inverseBindMatrices=s?.inverseBindMatrices??[],this.mesh.meshData=n,this.shader.initBuffers(this._gl,n),this.createJointTexture(Math.max(1,this.inverseBindMatrices.length)),this.jointReach=Vr.jointReach(n,this.inverseBindMatrices),this.loaded=!0,this._deformationVersion++}static jointReach(e,i){let n=new Float32Array(i.length).fill(-1),o=i.map(c=>E.getTranslation(x.create(),E.invert(E.create(),c)??E.create())),{joints:s,weights:a,vertices:l}=e;if(!s?.length||!a?.length)return n;for(let c=0;c<l.length;c++){let d=0;for(let m=1;m<4;m++)a[c*4+m]>a[c*4+d]&&(d=m);let h=s[c*4+d];h===void 0||h>=o.length||(n[h]=Math.max(n[h],x.distance(l[c],o[h])))}return n}worldBounds(e){if(!this.loaded||!this.parent)return!1;(this.bones.length!==this.boneIds.length||this.bones.some(h=>!h))&&this.resolveBones();let i=fo(this.parent.transform.modelMatrix),n=1/0,o=1/0,s=1/0,a=-1/0,l=-1/0,c=-1/0,d=e.center;for(let h=0;h<this.bones.length;h++){let m=this.bones[h],p=(this.jointReach[h]??-1)*i;!m||p<0||(E.getTranslation(d,m.modelMatrix),n=Math.min(n,d[0]-p),a=Math.max(a,d[0]+p),o=Math.min(o,d[1]-p),l=Math.max(l,d[1]+p),s=Math.min(s,d[2]-p),c=Math.max(c,d[2]+p))}return n>a?!1:(x.set(e.center,(n+a)/2,(o+l)/2,(s+c)/2),e.radius=Math.hypot(a-n,l-o,c-s)/2,!0)}get deformationVersion(){return this._deformationVersion}createJointTexture(e){let i=this._gl;this.jointData=new Float32Array(e*16);for(let n=0;n<e;n++)this.jointData.set(E.create(),n*16);this._jointTexture=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this._jointTexture),i.texImage2D(i.TEXTURE_2D,0,i.RGBA32F,4,e,0,i.RGBA,i.FLOAT,this.jointData),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.bindTexture(i.TEXTURE_2D,null)}resolveBones(){let e=this.parent?.scene;e&&(this.bones=this.boneIds.map(i=>e.getEntitieByUuid(i)?.transform??null))}beforeRender(){if(!this.loaded||!this._jointTexture)return;(this.bones.length!==this.boneIds.length||this.bones.some(s=>!s))&&this.resolveBones();let e=this.parent.transform;for(;e.parent;)e=e.parent;e.updateMatrices(),E.invert(this.meshInverse,this.parent.transform.modelMatrix);let i=Math.min(this.inverseBindMatrices.length,this.jointData.length/16),n=!1;for(let s=0;s<i;s++){let a=this.bones[s];if(!a)continue;E.multiply(this.scratch,this.meshInverse,a.modelMatrix),E.multiply(this.scratch,this.scratch,this.inverseBindMatrices[s]);let l=s*16;if(!n){for(let c=0;c<16;c++)if(this.jointData[l+c]!==this.scratch[c]){n=!0;break}}this.jointData.set(this.scratch,l)}if(!n)return;this._deformationVersion++;let o=this._gl;o.bindTexture(o.TEXTURE_2D,this._jointTexture),o.texSubImage2D(o.TEXTURE_2D,0,0,0,4,this.jointData.length/16,o.RGBA,o.FLOAT,this.jointData),o.bindTexture(o.TEXTURE_2D,null)}draw(){if(!this.loaded||!this.shader?._shaderProgram)return;let e=this._gl;this.shader.use(),e.activeTexture(e.TEXTURE0+Or),e.bindTexture(e.TEXTURE_2D,this._jointTexture);let i=e.getUniformLocation(this.shader._shaderProgram,"u_jointTexture");e.uniform1i(i,Or),e.activeTexture(e.TEXTURE0),super.draw(),cr.disableSkinAttributes(e,this.shader._shaderProgram)}destroy(){super.destroy(),this._jointTexture&&this._gl.deleteTexture(this._jointTexture),this._jointTexture=null,this.loaded=!1}toJsonObject(){let{mesh:e,...i}=super.toJsonObject();return{...i,meshUri:this.meshUri,skinUri:this.skinUri,boneIds:[...this.boneIds]}}fromJson(e){super.fromJson(e),this.meshUri=e.meshUri??"",this.skinUri=e.skinUri??"",this.boneIds=[...e.boneIds??[]]}};u(Vr,"SkinnedMeshRendererBehaviour");var Wr=Vr;var Ki=class Ki extends q{constructor(){super("ColorMaterial");this.color=new y}get type(){return this.constructor.name}static instanciate(){return new Ki}toJsonObject(){return{...super.toJsonObject(),name:this.name,color:this.color.toJsonObject()}}fromJson(e){super.fromJson(e),this.name=e.name,this.color=y.createFromJsonData(e.color)}};u(Ki,"ColorMaterial");var St=Ki;var Qi=class Qi extends St{constructor(){super(...arguments);this._className="UnlitMaterial";this.uvScale=new ir(1,1);this.uvOffset=new ir(0,0)}toJsonObject(){return{...super.toJsonObject(),mainTex:this.mainTex?.toJsonObject(),uvScale:[...this.uvScale.vector],uvOffset:[...this.uvOffset.vector]}}async fromJson(e){super.fromJson(e),e.mainTex?.url&&(this.mainTex=await W.for().getTexture(e.mainTex.url)),e.uvScale&&this.uvScale.set(...e.uvScale),e.uvOffset&&this.uvOffset.set(...e.uvOffset)}static instanciate(){return new Qi}destroy(){this.mainTex&&this.mainTex.destroy()}};u(Qi,"UnlitMaterial");var hr=Qi;var Zi=class Zi extends hr{constructor(){super();this._className="LitMaterial";this.specularStrength=.5;this.roughness=.01;this.normalMapStrength=.1}toJsonObject(){return{...super.toJsonObject(),normalTex:this.normalTex?.toJsonObject(),specularStrength:this.specularStrength,roughness:this.roughness,normalMapStrength:this.normalMapStrength}}async fromJson(e){await super.fromJson(e),e.normalTex?.url&&(this.normalTex=await W.for().getTexture(e.normalTex.url),this.normalTex.fromJson(e.normalTex)),this.roughness=e.roughness,this.normalMapStrength=e.normalMapStrength}static instanciate(){return new Zi}destroy(){super.destroy(),this.normalTex&&this.normalTex.destroy()}};u(Zi,"LitMaterial");var Vt=Zi;var en=class en extends St{constructor(){super(...arguments);this._className="CubemapMaterial"}async fromJson(e){if(super.fromJson(e),e.mainTex?.uris){let i=e.mainTex.uris;this.mainTex=await W.for().getCubemap({right:i[0],left:i[1],up:i[2],bottom:i[3],front:i[4],back:i[5]})}}toJsonObject(){return{...super.toJsonObject(),mainTex:this.mainTex?.toJsonObject()}}static instanciate(){return new en}};u(en,"CubemapMaterial");var mr=en;var $o=class $o extends mr{constructor(){super(...arguments);this._className="SkyboxMaterial";this.skyColor=new y(.35,.53,.7,1);this.horizonColor=new y(.7,.75,.8,1);this.groundColor=new y(.2,.2,.2,1);this.exponent=.6}toJsonObject(){return{...super.toJsonObject(),horizonColor:this.horizonColor.toJsonObject(),skyColor:this.skyColor.toJsonObject(),groundColor:this.groundColor.toJsonObject(),exponent:this.exponent}}async fromJson(e){await super.fromJson(e),this.horizonColor=y.createFromJsonData(e.horizonColor),this.skyColor=y.createFromJsonData(e.skyColor),this.groundColor=y.createFromJsonData(e.groundColor),this.exponent=e.exponent||this.exponent}};u($o,"SkyboxMaterial");var pr=$o;var tn=class tn extends K{static instanciate(r,e,i,n){return new tn}constructor(r=2){let e=r/2,i=[],n=[],o=[],s=[],a=u((l,c,d,h,m,p,v,f,g,b)=>{i.push(l,c,d,h),n.push(m,m,m,m),o.push(p,v,f,g),s.push(b+0,b+1,b+2,b+0,b+2,b+3)},"addFace");a([-e,-e,e],[e,-e,e],[e,e,e],[-e,e,e],[0,0,1],[0,0],[1,0],[1,1],[0,1],0),a([-e,e,-e],[e,e,-e],[e,-e,-e],[-e,-e,-e],[0,0,-1],[0,1],[0,0],[1,0],[1,1],4),a([-e,e,e],[e,e,e],[e,e,-e],[-e,e,-e],[0,1,0],[0,1],[1,1],[1,0],[0,0],8),a([-e,-e,-e],[e,-e,-e],[e,-e,e],[-e,-e,e],[0,-1,0],[0,1],[1,1],[1,0],[0,0],12),a([e,-e,e],[e,-e,-e],[e,e,-e],[e,e,e],[1,0,0],[0,0],[1,0],[1,1],[0,1],16),a([-e,-e,-e],[-e,-e,e],[-e,e,e],[-e,e,-e],[-1,0,0],[0,0],[1,0],[1,1],[0,1],20),super(i,n,o,s)}};u(tn,"CubePrimitive");var ge=tn;var jo=class jo extends K{constructor(r=2){let e=r/2,i=[],n=[],o=[],s=[];u((l,c,d,h,m,p,v,f,g,b)=>{i.push(l,c,d,h),n.push(m,m,m,m),o.push(p,v,f,g),s.push(b+0,b+1,b+2,b+0,b+2,b+3)},"addFace")([-e,-e,0],[e,-e,0],[e,e,0],[-e,e,0],[0,0,1],[0,0],[1,0],[1,1],[0,1],0),super(i,n,o,s)}};u(jo,"QuadPrimitive");var rn=jo;var on=class on extends ge{static instanciate(r,e,i,n){return new on}constructor(r=2){super(r)}};u(on,"SkyboxPrimitive");var nn=on;var Ko=class Ko extends K{constructor(r=1,e=32,i=16){let n=[],o=[],s=[],a=[];for(let l=0;l<=i;++l){let c=l/i,d=c*Math.PI;for(let h=0;h<=e;++h){let m=h/e,p=m*2*Math.PI,v=r*Math.sin(d)*Math.cos(p),f=r*Math.cos(d),g=r*Math.sin(d)*Math.sin(p);n.push([v,f,g]);let b=x.fromValues(v,f,g);x.normalize(b,b),o.push(Array.from(b)),s.push([m,c])}}for(let l=0;l<i;++l)for(let c=0;c<e;++c){let d=l*(e+1)+c,h=d+e+1;a.push(d,d+1,h),a.push(d+1,h+1,h)}super(n,o,s,a)}};u(Ko,"SpherePrimitive");var We=Ko;var Qo=class Qo extends K{constructor(){let r=[[0,1,0],[-1,-1,0],[1,-1,0]],e=[[0,0,1],[0,0,1],[0,0,1]],i=[[.5,1],[0,0],[1,0]],n=[0,1,2];super(r,e,i,n)}};u(Qo,"TrianglePrimitive");var sn=Qo;var ln=class ln extends K{static instanciate(r,e,i,n){return new ln}constructor(r=1){r=Math.max(1,Math.floor(r));let i=r/2,n=1,o=[],s=[],a=[],l=[];for(let c=0;c<=r;c++)for(let d=0;d<=r;d++){let h=-i+d*n,m=-i+c*n;o.push(x.fromValues(h,0,m)),s.push(x.fromValues(0,1,0)),a.push(ce.fromValues(d/r,c/r))}for(let c=0;c<r;c++)for(let d=0;d<r;d++){let h=c*(r+1)+d;l.push(h,h+(r+1),h+(r+1)+1),l.push(h,h+(r+1)+1,h+1)}super(o,s,a,l)}};u(ln,"PlanePrimitive");var an=ln;var cn=class cn extends Ve{static instanciate(r){return new cn(r)}constructor(r){super(r),this._className="SkyboxRenderer",this.createDefaultSkybox()}async createDefaultSkybox(){this.mesh.meshData=new ge;let r=new pr;this.shader=new Mt(this._gl,r),this.renderLayer=5,r.mainTex=await W.for(this._gl).getWhiteCubemap()}initialize(){return this.transform&&(this.transform.setLocalPosition(0,0,0),this.transform.setLocalScale(1e3,1e3,1e3)),super.initialize()}get material(){return this.shader?.material}setGlSettings(){this._gl.cullFace(this._gl.FRONT),this._gl.depthFunc(this._gl.LEQUAL)}setCameraMatrices(){if(!this.shader?._shaderProgram)return;let r=oe.mainCamera,e=E.clone(r.viewMatrix);e[12]=0,e[13]=0,e[14]=0;let i=E.create();this.transform.updateMatrices(),E.multiply(i,r.projectionMatrix,e),E.multiply(i,i,this.parent.transform.modelMatrix),this.shader.setMat4("u_mvpMatrix",i)}draw(){this.shader?._shaderProgram&&(this.setGlSettings(),this.setCameraMatrices(),this.setShaderVariables(),super.draw(),this.shader?.release())}setShaderVariables(){this.shader?._shaderProgram&&(super.setShaderVariables(),this.setGlSettings(),this.setCameraMatrices())}};u(cn,"SkyboxRenderer");var je=cn;var Hr=class Hr extends me{constructor(){super();this.moveSpeed=20;this.rotationSpeed=5;this.rotationDampening=.2;this.moveDampening=.15;this.scrollSpeed=1;this.boostMultiplier=4;this.moveKeys={forward:"w",back:"s",left:"a",right:"d",up:"q",down:"e",boost:"shift"};this.lookMouseButtons={pan:1,look:2};this._acceleration=4;this._forwardVelocity=0;this._strafeVelocity=0;this._upVelocity=0;this._currentYaw=0;this._currentPitch=0;this._className="CameraFlyBehaviour"}static instanciate(){return new Hr}initialize(){let e=this.transform.forward,i=180/Math.PI;return this._currentPitch=Math.asin(Math.max(-1,Math.min(1,-e[1])))*i,this._currentYaw=Math.atan2(e[0],e[2])*i,super.initialize()}update(e){this.updateInput(e)}updateMoveVelocity(e){let i=this._acceleration*e,n=he.keyDown[this.moveKeys.boost]?this.moveSpeed*this.boostMultiplier:this.moveSpeed,o=.1;this.updateForwardVelocity(i,n,o),this.updateStrafeVelocity(i,n,o),this.updateUpVelocity(i,n,o)}updateForwardVelocity(e,i,n){he.keyDown[this.moveKeys.forward]?this._forwardVelocity=Math.min(this._forwardVelocity+e,i):he.keyDown[this.moveKeys.back]?this._forwardVelocity=Math.max(this._forwardVelocity-e,-i):(this._forwardVelocity*=1-this.moveDampening,Math.abs(this._forwardVelocity)<n&&(this._forwardVelocity=0))}updateStrafeVelocity(e,i,n){he.keyDown[this.moveKeys.left]?this._strafeVelocity=Math.min(this._strafeVelocity+e,i):he.keyDown[this.moveKeys.right]?this._strafeVelocity=Math.max(this._strafeVelocity-e,-i):(this._strafeVelocity*=1-this.moveDampening,Math.abs(this._strafeVelocity)<n&&(this._strafeVelocity=0))}updateUpVelocity(e,i,n){he.keyDown[this.moveKeys.up]?this._upVelocity=Math.max(this._upVelocity-e,-i):he.keyDown[this.moveKeys.down]?this._upVelocity=Math.min(this._upVelocity+e,i):(this._upVelocity*=1-this.moveDampening,Math.abs(this._upVelocity)<n&&(this._upVelocity=0))}updatePanVelocity(e){ie.mouseButtonDown[this.lookMouseButtons.pan]&&(this._upVelocity+=ie.mouseMovement.y*this.moveSpeed*e/2,this._strafeVelocity+=ie.mouseMovement.x*this.moveSpeed*e/2)}updateScrollVelocity(e){this._forwardVelocity-=ie.wheelY*this._acceleration*this.moveDampening*this.scrollSpeed*e}applyMovementVelocity(e,i){let n=x.create();if(this.parent instanceof oe&&this.parent.cameraType===1){let s=this.parent;Math.abs(this._forwardVelocity)>0&&(s.orthoSize-=this._forwardVelocity*i,s.orthoSize=Math.max(.1,s.orthoSize),s.updateProjectionMatrix());let a=s.orthoSize/10;Math.abs(this._strafeVelocity)>0&&x.scaleAndAdd(n,n,e.right,this._strafeVelocity*a),Math.abs(this._upVelocity)>0&&x.scaleAndAdd(n,n,e.up,this._upVelocity*a)}else Math.abs(this._forwardVelocity)>0&&x.scaleAndAdd(n,n,e.forward,this._forwardVelocity),Math.abs(this._strafeVelocity)>0&&x.scaleAndAdd(n,n,e.right,this._strafeVelocity),Math.abs(this._upVelocity)>0&&x.scaleAndAdd(n,n,e.up,this._upVelocity);e.translate(n[0]*i,n[1]*i,n[2]*i)}applyRotationVelocity(e,i){ie.mouseButtonDown[this.lookMouseButtons.look]&&(!1||(this._currentYaw+=-ie.mouseMovement.x*this.rotationSpeed*i,this._currentPitch+=ie.mouseMovement.y*this.rotationSpeed*i)),this._currentPitch=Math.max(-90,Math.min(90,this._currentPitch));let o=X.create();X.fromEuler(o,0,this._currentYaw,0);let s=X.create();X.fromEuler(s,this._currentPitch,0,0);let a=X.create();X.multiply(a,o,s);let l=X.create();X.slerp(l,e.localRotationQuat,a,this.rotationDampening),e.worldRotationQuat=l}updateInput(e){if(!this._initialized||!this.parent?.transform)return;let i=this.parent.transform;this.updateMoveVelocity(e),this.updateScrollVelocity(e),this.updatePanVelocity(e),this.applyMovementVelocity(i,e),this.applyRotationVelocity(i,e)}clone(){let e=new Hr;return e.fromJson(this.toJsonObject()),e}};u(Hr,"CameraFlyBehaviour");var un=Hr;var Wt=u(t=>{let r=Math.max(0,Math.min(1,t));return r*r*(3-2*r)},"smoothstep"),hn=class hn extends me{constructor(){super(...arguments);this._className="SunBehaviour";this.dayCycleSettings={speed:new j(0,0,100,1),timeOfDay:new j(11,0,24.01,.5)};this.hours={sunrise:6,noon:12,sunset:18.5,night:20};this.lighColor={sunriseColor:new y(255/255,190/255,120/255,1),noonColor:new y(255/255,250/255,245/255,1),sunsetColor:new y(255/255,150/255,80/255,1),nightColor:new y(30/255,40/255,60/255,1)};this.dayPhaseColors={sunriseSkyColor:new y(.43,.47,.57,1),sunriseHorizonColor:new y(.34,.35,.35,1),noonSkyColor:new y(.53,.81,.92,1),noonHorizonColor:new y(.86,.92,.98,1),sunsetSkyColor:new y(.19,.21,.34,1),sunsetHorizonColor:new y(.32,.29,.28,1),nightSkyColor:new y(.04,.06,.12,1),nightHorizonColor:new y(.08,.12,.2,1)};this.sun={show:!0,sunHeight:new j(.725,0,.9,.015),sunSize:new j(.999,.8,1.04,1e-8),sunFalloff:new j(.01,1e-5,.2,1e-6)};this.moon={show:!0,phaseSpeed:5e-4,color:new y(.85,.9,.95,1),phase:new j(0,0,1.01,.01),useDirectionalLight:!1,earthshine:new j(.02,0,.4,.001),terminatorSoftness:new j(.5,.01,1,.01),enableRotation:!0,rotationSpeed:new j(.05,0,.5,.001)};this.shadows={nightStrength:new j(.2,0,1,.01),dayStrength:new j(.75,0,1,.01),fadeDuration:new j(1.2,0,2,.1)};this.clouds={show:!0,speed:new j(.01,.001,.5,1e-6),tiling:new j(.05,1e-4,2,1e-6),sparsity:new j(.01,0,1,1e-6),weather:new j(.4,0,1,1e-6),repetition:new j(1,0,10,1)};this.stars={show:!0,intensity:new j(3,0,20,.1),scale:new j(200,10,500,1),sparsity:new j(34,10,100,1),speed:new j(4e-4,0,.02,1e-4)}}static instanciate(){return new hn}initialize(){return this.parent?.scene?(this._serializationIgnoreKeys.push("moonLight"),this._skyboxRenderer=this.parent.getBehaviour(je),this._skyboxRenderer||(this._skyboxRenderer=this.parent.scene?.objects.find(e=>e.getBehaviour(je))?.getBehaviour(je)),this.update(0),super.initialize()):!1}update(e){if(!this.parent?.scene)return;super.update(e),this.updateTime(e);let i=this.parent.scene.lights.find(n=>n.entityType===1);i&&(this.updateOrCreateMoonLinght(),this.updateSunPosition(i,this.moonLight),this.updateLightColor(i,this.moonLight))}creaMoonLight(e){return e=new Tt("MoonLight"),e.tag="MoonLight",e.transform.setParent(this.transform),this.parent.scene.addEntity(e),this.moonLight=e,e}updateOrCreateMoonLinght(){if(this.moonLight=this.moonLight||this.parent.scene.lights.find(e=>e.tag==="MoonLight"),this.moon.useDirectionalLight){if(!this.parent.scene.isRunning)return;this.moonLight||(this.moonLight=this.creaMoonLight(this.moonLight)),this.moonLight.active=!0,this.moonLight.color=this.lighColor.nightColor}else this.moonLight&&(this.moonLight.active=!1)}updateTime(e){this.parent?.scene?.isRunning&&(this.dayCycleSettings.timeOfDay.value+=e*this.dayCycleSettings.speed.value*.01,this.dayCycleSettings.timeOfDay.value>=24&&(this.dayCycleSettings.timeOfDay.value-=24),this.dayCycleSettings.timeOfDay.value<0&&(this.dayCycleSettings.timeOfDay.value+=24)),this.moon.show&&(this.moon.phase.value+=e*this.moon.phaseSpeed*.01,this.moon.phase.value>1&&(this.moon.phase.value-=1),this.moon.phase.value<0&&(this.moon.phase.value+=1))}updateSunPosition(e,i){if(!e)return;let n=1,o=Math.acos(this.sun.sunHeight.value),s=(this.dayCycleSettings.timeOfDay.value/24-.25)*Math.PI*2,a=Math.cos(s)*n,l=Math.sin(s)*n,c=a,d=l*Math.cos(o),h=-l*Math.sin(o);e.transform.setWorldPosition(c,d,h),e.transform.lookAt(new Be(0,0,0)),i&&(i.transform.setWorldPosition(-c,-d,-h),i.transform.lookAt(new Be(0,0,0)))}getInterpolationData(){let e=this.dayCycleSettings.timeOfDay.value,{sunrise:i,noon:n,sunset:o,night:s}=this.hours,{sunriseColor:a,noonColor:l,sunsetColor:c,nightColor:d}=this.lighColor,{sunriseSkyColor:h,sunriseHorizonColor:m,noonSkyColor:p,noonHorizonColor:v,sunsetSkyColor:f,sunsetHorizonColor:g,nightSkyColor:b,nightHorizonColor:T}=this.dayPhaseColors;if(e>=i&&e<n)return{fromLightColor:a,toLightColor:l,fromSkyColor:h,toSkyColor:p,fromHorizonColor:m,toHorizonColor:v,delta:(e-i)/(n-i)};if(e>=n&&e<o)return{fromLightColor:l,toLightColor:c,fromSkyColor:p,toSkyColor:f,fromHorizonColor:v,toHorizonColor:g,delta:(e-n)/(o-n)};if(e>=o&&e<s)return{fromLightColor:c,toLightColor:d,fromSkyColor:f,toSkyColor:b,fromHorizonColor:g,toHorizonColor:T,delta:(e-o)/(s-o)};{let _=24-s+i,w=e>=s?e-s:24-s+e;return{fromLightColor:d,toLightColor:a,fromSkyColor:b,toSkyColor:h,fromHorizonColor:T,toHorizonColor:m,delta:w/_}}}updateLightColor(e,i){if(!e)return;let n=this.dayCycleSettings.timeOfDay.value,{sunrise:o,sunset:s,night:a}=this.hours,{fromLightColor:l,toLightColor:c,fromSkyColor:d,toSkyColor:h,fromHorizonColor:m,toHorizonColor:p,delta:v}=this.getInterpolationData(),f=Math.max(0,Math.min(1,v));e.color=y.lerp(l,c,f);let g=.5,b=1;if(n>=s-g&&n<=s){let _=(n-(s-g))/g;b=1-Wt(_)}else if(n>=o-g&&n<=o){let _=(n-(o-g))/g;b=Wt(_)}else(n>s||n<o-g)&&(b=.1);if(i){i.color=this.lighColor.nightColor.clone();let _=Wt(f);n>=o&&n<s?(e.color.a=b,i.color.a=.05):n>=s&&n<a-g?(e.color.a=b,i.color.a=_*this.lighColor.nightColor.a):(e.color.a=b,i.color.a=(1-_)*this.lighColor.nightColor.a)}else e.color.a=b;e.shadowStrength=this._calculateShadowStrength(n,this.shadows.dayStrength.value),this.updateSceneColors(e.color),n>this.hours.night-.5&&n<this.hours.night;let T=n<this.hours.sunrise||n>this.hours.sunset;this.updateSkybox(e,d,h,m,p,f,T)}_calculateShadowStrength(e,i){let n=0,o=i,s=this.shadows.nightStrength.value,a=this.shadows.fadeDuration.value,l=this.hours.sunset-a,c=this.hours.sunset+a,d=this.hours.sunrise-a,h=this.hours.sunrise+a;if(e>=h&&e<l)n=o;else if(e>=l&&e<this.hours.sunset){let m=(e-l)/(this.hours.sunset-l);n=(1-Wt(m))*o}else if(e>=this.hours.sunset&&e<c){let m=(e-this.hours.sunset)/(c-this.hours.sunset);n=Wt(m)*s}else if(e>=d&&e<this.hours.sunrise){let m=(e-d)/(this.hours.sunrise-d);n=(1-Wt(m))*s}else if(e>=this.hours.sunrise&&e<h){let m=(e-this.hours.sunrise)/(h-this.hours.sunrise);n=Wt(m)*o}else n=s;return Math.max(0,n)}updateSceneColors(e){let i=this.parent.scene;i&&(i.clearColor=e,i.sceneFog.color=e)}updateSkybox(e,i,n,o,s,a,l){let c=this.parent.scene;!c||!e||(this._skyboxRenderer||(this._skyboxRenderer=c.objects.find(d=>d.getBehaviour(je))?.getBehaviour(je)),this._skyboxRenderer?.shader instanceof Mt&&this._updateSkyboxShaderVariables(this._skyboxRenderer,e,i,n,o,s,a,l))}_updateSkyboxShaderVariables(e,i,n,o,s,a,l,c){let d=e.shader;d.material.color=y.lerp(n,o,l),d.material.horizonColor=y.lerp(s,a,l),this.parent.scene.sceneFog.color=d.material.horizonColor,d.sun.useSun=this.sun.show,d.moon.useMoon=this.moon.show,d.sun.sunSize=this.sun.sunSize.value,d.sun.sunFalloff=this.sun.sunFalloff.value;let h=x.normalize(x.create(),this.transform.worldPosition);d.sun.sunDirection.set(h[0],h[1],h[2]),d.sun.sunColor=i.color,this.moon.show&&(d.moon.moonDirection.set(-h[0],-h[1],-h[2]),d.moon.moonPhase=this.moon.phase.value,d.moon.moonColor=y.lerp(this.moon.color,i.color,.4),d.moon.moonEarthshine=this.moon.earthshine.value,d.moon.moonTerminatorSoftness=this.moon.terminatorSoftness.value,d.moon.moonEnableRotation=this.moon.enableRotation?1:0,d.moon.moonRotationSpeed=this.moon.rotationSpeed.value),d.clouds.useClouds=this.clouds.show,this.clouds.show&&(d.clouds.cloudSpeed=this.clouds.speed.value,d.clouds.cloudTiling=this.clouds.tiling.value,d.clouds.cloudSparsity=this.clouds.sparsity.value,d.clouds.cloudRepetition=this.clouds.repetition.value,d.clouds.wheatherCondition=this.clouds.weather.value),d.stars.useStars=this.stars.show,this.stars.show&&(d.stars.starIntensity=this.stars.intensity.value,d.stars.starScale=this.stars.scale.value,d.stars.starSparsity=this.stars.sparsity.value,d.stars.starSpeed=this.stars.speed.value)}toJsonObject(){return this.serializeAutomatically()}fromJson(e){super.fromJson(e),this.deserializeAutomatically(e)}};u(hn,"SunBehaviour");var dn=hn;var pn=class pn extends me{constructor(){super(...arguments);this._className="RotateBehaviour";this.rotationAngle=new Be(0,1,0);this.speed=.005}static instanciate(){return new pn}update(e){let i=this.speed*e;this.transform.rotate(this.rotationAngle.x*i,this.rotationAngle.y*i,this.rotationAngle.z*i)}toJsonObject(){return this.serializeAutomatically()}fromJson(e){super.fromJson(e),this.deserializeAutomatically(e)}};u(pn,"RotateBehaviour");var mn=pn;var Zo=class Zo{constructor(r,e){this.onPointerDown=u(r=>{this.canvas.setPointerCapture?.(r.pointerId),Gt._down(r.pointerId,r.pointerType,...this.pointerXY(r),r.timeStamp)},"onPointerDown");this.onPointerMove=u(r=>{if(!Gt.active.has(r.pointerId))return;let e=r.getCoalescedEvents?.()??[];for(let i of e.length?e:[r])Gt._move(r.pointerId,...this.pointerXY(i),i.timeStamp)},"onPointerMove");this.onPointerUp=u(r=>{Gt._up(r.pointerId,...this.pointerXY(r),r.timeStamp)},"onPointerUp");this.onEngineContextMenu=u(r=>{r.preventDefault()},"onEngineContextMenu");this.onEngineKeyDown=u(r=>{he.keyDown[r.key.toLowerCase()]=!0},"onEngineKeyDown");this.onEngineKeyUp=u(r=>{he.keyDown[r.key.toLowerCase()]&&(he.keyUp[r.key.toLowerCase()]=!0,he.keyPress[r.key.toLowerCase()]=!0),he.keyDown[r.key.toLowerCase()]=!1},"onEngineKeyUp");this.onEngineMouseMove=u(r=>{let e=this.canvas.getBoundingClientRect();ie.mousePosition.x=Math.max(r.clientX-e.x,0),ie.mousePosition.y=Math.max(r.clientY-e.y,0),ie.mouseMovement.x=r.movementX,ie.mouseMovement.y=r.movementY},"onEngineMouseMove");this.onEngineMouseDown=u(r=>{this.engine.isFocused&&r.preventDefault(),ie.mouseButtonDown[r.button]=!0},"onEngineMouseDown");this.onEngineMouseUp=u(r=>{ie.mouseButtonDown[r.button]=!1},"onEngineMouseUp");this.onEngineMouseLeave=u(()=>{for(let r in ie.mouseButtonDown)ie.mouseButtonDown[r]&&(ie.mouseButtonDown[r]=!1)},"onEngineMouseLeave");this.onEngineFocus=u(()=>{this.engine.isFocused=!0},"onEngineFocus");this.onEngineBlur=u(()=>{this.engine.isFocused=!1},"onEngineBlur");this.onEngineMouseScroll=u(r=>{this.engine.isFocused&&(ie.wheelY=r.deltaY,ie.wheelX=r.deltaX)},"onEngineMouseScroll");this.onEngineVisibilityChange=u(()=>{this.engine.isTabActive=!document.hidden},"onEngineVisibilityChange");this.onEngineWindowFocus=u(()=>{this.engine.isWindowFocused=!0},"onEngineWindowFocus");this.onEngineWindowBlur=u(()=>{this.engine.isWindowFocused=!1},"onEngineWindowBlur");this.engine=r,this.canvas=e}initialize(){this.canvas.tabIndex=0,this.canvas.addEventListener("contextmenu",this.onEngineContextMenu),this.canvas.addEventListener("keydown",this.onEngineKeyDown),this.canvas.addEventListener("keyup",this.onEngineKeyUp),this.canvas.addEventListener("mousemove",this.onEngineMouseMove),this.canvas.addEventListener("mousedown",this.onEngineMouseDown),this.canvas.addEventListener("mouseup",this.onEngineMouseUp),this.canvas.addEventListener("mouseleave",this.onEngineMouseLeave),this.canvas.addEventListener("focus",this.onEngineFocus),this.canvas.addEventListener("blur",this.onEngineBlur),this.canvas.addEventListener("wheel",this.onEngineMouseScroll),this.canvas.style.touchAction="none",this.canvas.addEventListener("pointerdown",this.onPointerDown),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("pointerup",this.onPointerUp),this.canvas.addEventListener("pointercancel",this.onPointerUp),document.addEventListener("visibilitychange",this.onEngineVisibilityChange),window.addEventListener("focus",this.onEngineWindowFocus),window.addEventListener("blur",this.onEngineWindowBlur)}pointerXY(r){let e=this.canvas.getBoundingClientRect();return[r.clientX-e.left,r.clientY-e.top]}update(){ie.mouseMovement.x=0,ie.mouseMovement.y=0,ie.wheelX=0,ie.wheelY=0,he.keyUp={},he.keyPress={},bi.update()}};u(Zo,"EngineEventManager");var fn=Zo;function Za(t){let r=t.interpolation==="CUBICSPLINE"?3:0;return t.values.subarray(r,r+3)}u(Za,"firstKey");function es(t){return t.replace(/:/g,"_")}u(es,"boneAlias");var ts=class ts{constructor(){this.listeners=[]}subscribe(r){return this.listeners.push(r),()=>{this.listeners=this.listeners.filter(e=>e!==r)}}emit(r){for(let e of[...this.listeners])e(r)}};u(ts,"AnimationEvent");var vn=ts,gn=class gn extends me{constructor(){super();this._className="Animator";this.clipUris=[];this.defaultClip="";this.playOnStart=!0;this.speed=1;this.loop=!0;this.playInEditor=!1;this.inPlace=!1;this.onFinished=new vn;this.onLoop=new vn;this.clips=[];this.codeClips=[];this.current=null;this.previous=null;this.fadeDuration=0;this.fadeTime=0;this.bonesByName=new Map;this.loading=null;this.value=new Float32Array(4);this.blendA=new Float32Array(4);this.q1=X.create();this.q2=X.create();this._serializationIgnoreKeys.push("onFinished","onLoop","clips","codeClips","current","previous","fadeDuration","fadeTime","bonesByName","loading","value","blendA","q1","q2")}static instanciate(){return new gn}get clipList(){return this.clips}get currentClip(){return this.current?.clip??null}get time(){return this.current?.time??0}set time(e){this.current&&(this.current.time=e,this.current.finished=!1,this.apply())}whenLoaded(){return this.loading??Promise.resolve()}initialize(){let e=super.initialize();return this.playInEditor&&this.parent&&(this.parent.updateInEditor=!0),this.loading=this.loadClips().catch(i=>console.error("Animator: cannot load clips",i)),e}async loadClips(){let e=[];for(let i of this.clipUris){let n=bt(i);if(n?.kind!=="anim"){console.warn(`Animator: "${i}" is not <model>#anim/<n>`);continue}let s=(await W.for().getModel(n.modelUri)).clips[n.index];s&&e.push(s)}this.clips=[...e,...this.codeClips],this.playOnStart&&e.length&&!this.current&&this.play(this.defaultClip||e[0].name)}addClip(e){this.codeClips.push(e),this.clips.push(e)}getClip(e){return typeof e=="number"?this.clips[e]:this.clips.find(i=>i.name===e)}play(e,i={}){let n=this.getClip(e);return n?(this.current=this.stateFor(n,i.loop??this.loop),this.previous=null,this.fadeDuration=0,this.apply(),!0):(console.warn(`Animator: no clip "${e}"`),!1)}crossFade(e,i=.25,n={}){let o=this.getClip(e);return o?!this.current||i<=0?this.play(e,n):(this.current.clip===o&&!this.previous||(this.previous=this.current,this.current=this.stateFor(o,n.loop??this.loop),this.fadeDuration=i,this.fadeTime=0),!0):(console.warn(`Animator: no clip "${e}"`),!1)}stop(){this.current=null,this.previous=null}isPlaying(e){return!this.current||this.current.finished?!1:!e||this.current.clip.name===e}update(e){!this.parent?.scene?.isRunning&&!this.playInEditor||this.advance(e)}advance(e){if(this.current){for(let i of[this.current,this.previous])i&&this.step(i,e*this.speed);if(this.previous){this.fadeTime+=Math.abs(e*this.speed);let i=Math.min(1,this.fadeTime/this.fadeDuration);this.current.weight=i,i>=1&&(this.previous=null)}this.apply()}}step(e,i){if(e.finished)return;let n=e.clip.duration;e.time+=i,!(n<=0)&&(e.loop?(e.time>=n||e.time<0)&&(e.time=(e.time%n+n)%n,e===this.current&&this.onLoop.emit(e.clip)):(e.time>=n||e.time<=0)&&(e.time=Math.min(Math.max(e.time,0),n),e.finished=!0,e===this.current&&this.onFinished.emit(e.clip)))}stateFor(e,i){this.bonesByName.size||this.collectBones();let n=e.channels.map(a=>this.bonesByName.get(a.target)??this.bonesByName.get(es(a.target))??null);n.some(a=>!a)&&(this.collectBones(),n=e.channels.map(a=>this.bonesByName.get(a.target)??this.bonesByName.get(es(a.target))??null));let o=u(a=>{let l=0;for(let c=a;c&&c!==this.parent?.transform;c=c.parent)l++;return a?l:1/0},"depth"),s=-1;return e.channels.forEach((a,l)=>{a.property==="translation"&&n[l]&&(s<0||o(n[l])<o(n[s]))&&(s=l)}),{clip:e,time:this.speed<0?e.duration:0,weight:1,hints:e.channels.map(()=>0),targets:n,loop:i,finished:!1,rootChannel:s}}collectBones(){this.bonesByName.clear();let e=u(i=>{let n=i.parentEntity;n&&!this.bonesByName.has(n.name)&&this.bonesByName.set(n.name,i);let o=n?es(n.name):"";n&&!this.bonesByName.has(o)&&this.bonesByName.set(o,i);for(let s of i.children)e(s)},"visit");this.parent&&e(this.parent.transform)}apply(){let e=this.current;if(!e)return;let i=this.previous,n=new Map;i&&e.weight<1&&i.clip.channels.forEach((o,s)=>{let a=i.targets[s];if(!a)return;if(i.hints[s]=Ro(o,i.time,this.blendA,i.hints[s]),this.inPlace&&s===i.rootChannel){let c=Za(o);this.blendA[0]=c[0],this.blendA[2]=c[2]}let l=n.get(a);l||n.set(a,l=new Map),l.set(o.property,Float32Array.from(this.blendA))}),e.clip.channels.forEach((o,s)=>{let a=e.targets[s];if(!a)return;if(e.hints[s]=Ro(o,e.time,this.value,e.hints[s]),this.inPlace&&s===e.rootChannel){let c=Za(o);this.value[0]=c[0],this.value[2]=c[2]}let l=n.get(a)?.get(o.property);l&&this.mix(o,l,this.value,e.weight),this.write(a,o,this.value)})}mix(e,i,n,o){if(e.property==="rotation")X.set(this.q1,i[0],i[1],i[2],i[3]),X.set(this.q2,n[0],n[1],n[2],n[3]),X.slerp(this.q1,this.q1,this.q2,o),n.set(this.q1);else for(let s=0;s<3;s++)n[s]=i[s]+(n[s]-i[s])*o}write(e,i,n){i.property==="translation"?e.setLocalPosition(n[0],n[1],n[2]):i.property==="scale"?e.setLocalScale(n[0],n[1],n[2]):e.setLocalRotationQuat(X.set(this.q1,n[0],n[1],n[2],n[3]))}toJsonObject(){return{...super.toJsonObject(),clipUris:[...this.clipUris],defaultClip:this.defaultClip,playOnStart:this.playOnStart,speed:this.speed,loop:this.loop,playInEditor:this.playInEditor,inPlace:this.inPlace}}fromJson(e){super.fromJson(e),this.clipUris=[...e.clipUris??[]],this.defaultClip=e.defaultClip??"",this.playOnStart=e.playOnStart??!0,this.speed=e.speed??1,this.loop=e.loop??!0,this.playInEditor=e.playInEditor??!1,this.inPlace=e.inPlace??!1}};u(gn,"Animator");var Ht=gn;var rs=class rs{registerDependencies(){z.addDependency("SceneEntity",(r,e)=>new xe(r,e),{name:"SceneEntity",type:"Entity",path:"Entities",description:"Base Entity for all entities in the scene."}),z.addDependency("Camera",oe.instanciate,{name:"Camera",type:"Entity",path:"Entities",description:"Represents a camera in the 3D scene, generating view and projection matrices."}),z.addDependency("Light",Xe.instanciate,{name:"Light",type:"Light",path:"Entities/Light",description:"Ambient light source providing general illumination to the scene without a specific direction or position."}),z.addDependency("PointLight",Ui.instanciate,{name:"PointLight",type:"Light",path:"Entities/Light",description:"A light source that emits light in all directions from a single point."}),z.addDependency("SpotLight",zi.instanciate,{name:"SpotLight",type:"Light",path:"Entities/Light",description:"A light source that casts a cone of light in a specific direction."}),z.addDependency("DirectionalLight",Tt.instanciate,{name:"DirectionalLight",type:"Light",path:"Entities/Light",description:"A directional light source simulating light from a distant source like the sun."}),z.addDependency("Color",()=>new y),z.addDependency("Transform",()=>new ze,{name:"Transform",type:"Transform",path:"Core",description:"Represents the position, rotation, and scale of an object in 3D space."}),z.addDependency("MeshData",K.instanciate,{name:"MeshData",type:"Mesh",path:"Geometry",description:"Base class for geometric mesh data holding vertices, normals, and UVs."}),z.addDependency("CubePrimitive",ge.instanciate,{name:"CubePrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A primitive mesh representing a 3D cube."}),z.addDependency("PlanePrimitive",an.instanciate,{name:"PlanePrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A flat square grid on the XZ plane."}),z.addDependency("QuadPrimitive",rn.instanciate,{name:"QuadPrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A primitive mesh representing a 2D quad/plane."}),z.addDependency("SpherePrimitive",We.instanciate,{name:"SpherePrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A primitive mesh representing a 3D sphere."}),z.addDependency("SkyboxPrimitive",nn.instanciate,{name:"SkyboxPrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A primitive mesh specifically structured for skyboxes."}),z.addDependency("TrianglePrimitive",sn.instanciate,{name:"TrianglePrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A primitive mesh representing a simple 2D triangle."}),z.addDependency("Shader",Ie.instanciate,{name:"Shader",type:"Shader",path:"Shaders",description:"Base class managing the creation and compilation of WebGL shader programs."}),z.addDependency("SkyboxShader",Mt.instanciate,{name:"SkyboxShader",type:"Shader",path:"Shaders",description:"A specialized shader for rendering cubemap skyboxes."}),z.addDependency("UnlitShader",Ji.instanciate,{name:"UnlitShader",type:"Shader",path:"Shaders",description:"A shader for rendering unlit materials not affected by scene lights."}),z.addDependency("LitShader",at.instanciate,{name:"LitShader",type:"Shader",path:"Shaders",description:"A shader for rendering objects with lighting and normal mapping, implementing the Phong lighting model."}),z.addDependency("EntityBehaviour",me.instanciate,{name:"EntityBehaviour",type:"EntityBehaviour",path:"Behaviours",description:"Base class for all entity behaviours."}),z.addDependency("RendererBehaviour",_e.instanciate,{name:"RendererBehaviour",type:"RenderBehaviour",path:"Behaviours/Renderers",description:"Base class for all rendering behaviours."}),z.addDependency("MeshRendererBehaviour",Ve.instanciate,{name:"MeshRendererBehaviour",type:"RenderBehaviour",path:"Behaviours/Renderers",description:"Renders 3D meshes using the assigned material and shader."}),z.addDependency("SkinnedMeshRendererBehaviour",Wr.instanciate,{name:"SkinnedMeshRendererBehaviour",type:"RenderBehaviour",path:"Behaviours/Renderers",description:"Renders a mesh from a model file, deformed by its bone entities."}),z.addDependency("SunBehaviour",dn.instanciate,{name:"SunBehaviour",type:"EntityBehaviour",path:"Behaviours/SunBehaviour",description:"Moves the sun through a day/night cycle and drives the skybox: sky colours, clouds, stars and an optional moon."}),z.addDependency("RotateBehaviour",mn.instanciate,{name:"RotateBehaviour",type:"EntityBehaviour",path:"Behaviours/RotateBehaviour",description:"Continuously rotates the entity along its axis over time."}),z.addDependency("Animator",Ht.instanciate,{name:"Animator",type:"EntityBehaviour",path:"Behaviours/Animation",description:"Plays animation clips from model files on the bones under its entity."}),z.addDependency("SkyboxRenderer",je.instanciate,{name:"SkyboxRenderer",type:"RenderBehaviour",path:"Behaviours/Renderers",description:"A specialized renderer for drawing a skybox background."}),z.addDependency("ColorMaterial",St.instanciate,{name:"ColorMaterial",type:"Material",path:"Materials",description:"A basic material representing a solid color."}),z.addDependency("UnlitMaterial",hr.instanciate,{name:"UnlitMaterial",type:"Material",path:"Materials",description:"A material used for unlit shaders, ignoring scene lighting."}),z.addDependency("LitMaterial",Vt.instanciate,{name:"LitMaterial",type:"Material",path:"Materials/Lit",description:"A material supporting physical lighting properties like roughness, specular strength, and normal mapping."}),z.addDependency("CubemapMaterial",mr.instanciate,{name:"CubemapMaterial",type:"Material",path:"Materials",description:"A material used specifically for skyboxes and reflections, mapping a cubemap texture."}),z.addDependency("SkyboxMaterial",()=>new pr,{name:"SkyboxMaterial",type:"Material",path:"Materials",description:"A specialized skybox material used specifically within the editor environment."}),z.addDependency("CameraFlyBehaviour",un.instanciate,{name:"CameraFlyBehaviour",type:"EntityBehaviour",path:"Behaviours/Camera",description:"A free-look camera controller allowing movement and rotation via keyboard and mouse."}),Ie.preFetchFunctionsGlsl()}};u(rs,"DependencyManager");var fr=rs;var is=class is{constructor(){this.isFocused=!1;this.isTabActive=!0;this.isWindowFocused=!0;this.dependencyManager=new fr}get currentScene(){return this.scene}initialize(r){this.eventManager=new fn(this,r),this.eventManager.initialize()}registerDependencies(){this.dependencyManager.registerDependencies()}loadScene(r){this.scene=r,this.scene.initialize()}update(r){this.scene?.update(r)}render(){this.scene?.draw()}destroy(){this.scene?.destroy()}handleFocusChange(r){this.isFocused=r,this.isTabActive=document.visibilityState==="visible",this.isWindowFocused=r}};u(is,"Engine");var bn=is;var yn=class yn extends me{constructor(){super();this._className="RigidBodyBehaviour";this.bodyType="dynamic";this.mass=0;this.linearDamping=0;this.angularDamping=.05;this.ccd=!1;this.gravityScale=1;this.canSleep=!0;this.world=null;this._handle=-1;this._position=x.create();this._rotation=X.create();this._prevPosition=x.create();this._prevRotation=X.create();this._serializationIgnoreKeys.push("world","_handle","_position","_rotation","_prevPosition","_prevRotation")}static instanciate(){return new yn}initialize(){return this.world??(this.world=Jr.main),this.world||console.warn("RigidBodyBehaviour: no PhysicsWorld; create one before adding bodies."),this.world?._addBody(this),super.initialize()}destroy(){this.world?._removeBody(this)}get created(){return this._handle>=0}get isSleeping(){return this.backend()?this.backend().isSleeping(this._handle):!1}wakeUp(){this.backend()?.wakeUp(this._handle)}getLinearVelocity(e=x.create()){return this.backend()?.getLinearVelocity(this._handle,e)??x.zero(e)}setLinearVelocity(e){this.backend()?.setLinearVelocity(this._handle,e)}getAngularVelocity(e=x.create()){return this.backend()?.getAngularVelocity(this._handle,e)??x.zero(e)}setAngularVelocity(e){this.backend()?.setAngularVelocity(this._handle,e)}applyImpulse(e,i){this.backend()?.applyImpulse(this._handle,e,i)}applyTorqueImpulse(e){this.backend()?.applyTorqueImpulse(this._handle,e)}addForce(e){this.backend()?.addForce(this._handle,e)}resetForces(){this.backend()?.resetForces(this._handle)}teleport(e,i=this.transform.worldRotationQuat){this.transform.worldPosition=e,this.transform.worldRotationQuat=i;let n=this.backend();n&&(n.setBodyPose(this._handle,e,i),this._resetPose(e,i))}_resetPose(e,i){x.copy(this._position,e),x.copy(this._prevPosition,e),X.copy(this._rotation,i),X.copy(this._prevRotation,i)}backend(){return this.world?(this._handle<0&&this.world.flush(),this._handle>=0?this.world._backendWorld():null):null}toJsonObject(){return this.serializeAutomatically()}fromJson(e){super.fromJson(e),this.deserializeAutomatically(e)}};u(yn,"RigidBodyBehaviour");var xn=yn;var lt=class lt extends me{constructor(e,i={}){super();this._className="PhysicsWorld";this.timeScale=1;this.paused=!1;this.accumulator=0;this.bodies=new Set;this.pendingBodies=new Set;this.pendingColliders=new Set;this.colliders=new Map;this.contactListeners=new Set;this.forceListeners=new Set;this.stepListeners=new Set;this.backend=e,this._gravity=x.fromValues(...i.gravity??[0,-9.81,0]),this.fixedTimeStep=i.fixedTimeStep??1/60,this.maxSubSteps=i.maxSubSteps??5,this.interpolate=i.interpolate??!0,this.world=e.createWorld(this._gravity),lt.main??(lt.main=this),this._serializationIgnoreKeys.push("backend","world","bodies","pendingBodies","pendingColliders","colliders","contactListeners","forceListeners","stepListeners","accumulator")}get gravity(){return x.clone(this._gravity)}set gravity(e){x.copy(this._gravity,e),this.world.setGravity(this._gravity)}onContact(e){return this.contactListeners.add(e),()=>this.contactListeners.delete(e)}onContactForce(e){return this.forceListeners.add(e),()=>this.forceListeners.delete(e)}onBeforeStep(e){return this.stepListeners.add(e),()=>this.stepListeners.delete(e)}step(e){let i=this.fixedTimeStep;this.accumulator+=Math.max(0,e)*this.timeScale;let n=0;for(;this.accumulator>=i-1e-9&&n<this.maxSubSteps;)this.stepOnce(),this.accumulator=Math.max(0,this.accumulator-i),n++;n===this.maxSubSteps&&(this.accumulator=Math.min(this.accumulator,i)),this.writeTransforms(this.interpolate?this.accumulator/i:1)}stepOnce(){this.flush();for(let e of this.stepListeners)e(this.fixedTimeStep);for(let e of this.bodies)e.bodyType==="kinematic"&&e.transform&&this.world.setKinematicTarget(e._handle,e.transform.worldPosition,e.transform.worldRotationQuat);this.world.step(this.fixedTimeStep);for(let e of this.bodies)e.bodyType==="dynamic"&&(x.copy(e._prevPosition,e._position),X.copy(e._prevRotation,e._rotation),this.world.getBodyPose(e._handle,e._position,e._rotation));this.dispatchEvents(),this.writeTransforms(1)}flush(){for(let i of this.pendingBodies)this.createBody(i);if(this.pendingBodies.clear(),!this.pendingColliders.size)return;let e=new Map;for(let i of this.pendingColliders){let n=wm(i.parent),o=n&&n._handle>=0?n:null;e.has(o)||e.set(o,[]),e.get(o).push(i)}this.pendingColliders.clear();for(let[i,n]of e)for(let o of n)this.createCollider(o,i,i&&i.mass>0?i.mass/n.length:0)}raycast(e,i,n=1e3,o=!0){let s=this.world.raycast(e,i,n,o),a=s&&this.colliders.get(s.collider);return!s||!a?null:{collider:a,entity:a.parent,distance:s.distance,point:s.point,normal:s.normal}}beforeUpdate(e){this.paused||this.step(e)}afterUpdate(){}beforeDraw(){}afterDraw(){}destroy(){for(let e of this.bodies)e._handle=-1;for(let e of this.colliders.values())e._handle=-1;this.bodies.clear(),this.colliders.clear(),this.pendingBodies.clear(),this.pendingColliders.clear(),this.world.destroy(),lt.main===this&&(lt.main=null)}_backendWorld(){return this.world}_addBody(e){e._handle<0&&this.pendingBodies.add(e)}_removeBody(e){if(this.pendingBodies.delete(e),!(e._handle<0)){for(let[i,n]of this.colliders)n._body===e&&(this.colliders.delete(i),n._handle=-1,n._body=null);this.world.removeBody(e._handle),this.bodies.delete(e),e._handle=-1}}_addCollider(e){e._handle<0&&this.pendingColliders.add(e)}_removeCollider(e){this.pendingColliders.delete(e),!(e._handle<0)&&(this.world.removeCollider(e._handle),this.colliders.delete(e._handle),e._handle=-1,e._body=null)}createBody(e){let i=e.transform;if(!i)return;let n=i.worldPosition,o=i.worldRotationQuat;e._handle=this.world.createBody({type:e.bodyType,position:n,rotation:o,linearDamping:e.linearDamping,angularDamping:e.angularDamping,ccd:e.ccd,gravityScale:e.gravityScale,canSleep:e.canSleep}),e._resetPose(n,o),this.bodies.add(e)}createCollider(e,i,n){let o=e.transform;if(!o)return;let s=o.worldScale,a=o.worldRotationQuat,l=x.transformQuat(x.create(),x.mul(x.create(),x.fromValues(e.offset[0],e.offset[1],e.offset[2]),s),a),c=x.add(x.create(),o.worldPosition,l),d=c,h=a;if(i){let p=X.invert(X.create(),i._rotation);d=x.transformQuat(x.create(),x.sub(x.create(),c,i._position),p),h=X.mul(X.create(),p,a)}let m={shape:Tm(e.shape,s),position:d,rotation:h,friction:e.friction,restitution:e.restitution,density:e.density,mass:e.mass>0?e.mass:n,sensor:e.sensor,contactEvents:e.contactEvents,contactForceThreshold:e.contactForceThreshold};e._handle=this.world.createCollider(m,i?i._handle:null),e._body=i,this.colliders.set(e._handle,e)}writeTransforms(e){let i=x.create(),n=X.create();for(let o of this.bodies)o.bodyType!=="dynamic"||!o.transform||(e>=1?(x.copy(i,o._position),X.copy(n,o._rotation)):(x.lerp(i,o._prevPosition,o._position,e),X.slerp(n,o._prevRotation,o._rotation,e)),o.transform.worldPosition=i,o.transform.worldRotationQuat=n)}dispatchEvents(){this.world.drainEvents((e,i,n)=>{let o=this.colliders.get(e),s=this.colliders.get(i);if(!o||!s)return;let a={a:o,b:s,started:n};o.onContact?.(a,s),s.onContact?.(a,o);for(let l of this.contactListeners)l(a)},(e,i,n)=>{let o=this.colliders.get(e),s=this.colliders.get(i);if(!o||!s)return;let a={a:o,b:s,force:n};for(let l of this.forceListeners)l(a)})}};u(lt,"PhysicsWorld"),lt.main=null;var Jr=lt;function wm(t){for(let r=t?.transform;r;r=r.parent??void 0){let e=r.parentEntity?.getBehaviour(xn);if(e)return e}return null}u(wm,"findBody");function Tm(t,r){let e=Math.abs(r[0]),i=Math.abs(r[1]),n=Math.abs(r[2]);switch(t.type){case"sphere":return{type:"sphere",radius:t.radius*Math.max(e,i,n)};case"box":return{type:"box",halfExtents:[t.halfExtents[0]*e,t.halfExtents[1]*i,t.halfExtents[2]*n]};case"capsule":case"cylinder":return{type:t.type,halfHeight:t.halfHeight*i,radius:t.radius*Math.max(e,n)};case"convexHull":return{type:"convexHull",points:t.points.map((o,s)=>o*[e,i,n][s%3])};case"trimesh":return{type:"trimesh",vertices:t.vertices.map((o,s)=>o*[e,i,n][s%3]),indices:t.indices}}}u(Tm,"scaleShape");var Mm={".":"empty"," ":"empty","#":"ground",X:"block",B:"brick","?":"bonus","!":"power","*":"star","^":"spikes"},_n={start:"S",goal:"F"},tl={o:"coin",$:"big",g:"walker",k:"shell",v:"flyer",C:"checkpoint"},Ke={move:"=",fall:"~",trackX:"-",trackY:"|"},Sm={empty:!1,ground:!0,block:!0,brick:!0,bonus:!0,power:!0,star:!0,used:!0,spikes:!1};function Em(t){return Sm[t]}u(Em,"isSolid");function rl(t){let r=t.rows.length,e=Math.max(...t.rows.map(c=>c.length)),i=Array.from({length:e},()=>Array(r).fill("empty")),n=null,o=null,s=[],a=[],l=u((c,d)=>t.rows[d]?.[c]??".","at");if(t.rows.forEach((c,d)=>{let h=r-1-d;for(let m=0;m<c.length;m++){let p=c[m];if(p===Ke.trackX||p===Ke.trackY)continue;if(p===Ke.move||p===Ke.fall){if(l(m-1,d)===p)continue;let f=1;for(;l(m+f,d)===p;)f++;let g=null;if(p===Ke.move){let b=m,T=m+f;for(;l(b-1,d)===Ke.trackX;)b--;for(;l(T,d)===Ke.trackX;)T++;if(b<m||T>m+f)g={axis:"x",from:b,to:T-f};else{let _=d,w=d;for(let S=m;S<m+f;S++){let M=d,L=d;for(;l(S,M-1)===Ke.trackY;)M--;for(;l(S,L+1)===Ke.trackY;)L++;_=Math.min(_,M),w=Math.max(w,L)}(_<d||w>d)&&(g={axis:"y",from:r-1-w,to:r-1-_})}}a.push({kind:p===Ke.move?"move":"fall",x:m,y:h,w:f,track:g});continue}if(p===_n.start){n={x:m+.5,y:h};continue}if(p===_n.goal){o={x:m+.5,y:h};continue}if(tl[p]){s.push({kind:tl[p],x:m+.5,y:h});continue}let v=Mm[p];if(!v)throw new Error(`${t.name}: unknown tile '${p}' at row ${d}, column ${m}`);i[m][h]=v}}),!n)throw new Error(`${t.name}: no start (${_n.start})`);if(!o)throw new Error(`${t.name}: no goal (${_n.goal})`);return{name:t.name,width:e,height:r,tiles:i,start:n,goal:o,things:s,platforms:a,theme:t.theme??"meadow"}}u(rl,"parseLevel");function He(t,r,e){return r<0?"block":r>=t.width||e<0||e>=t.height?"empty":t.tiles[r][e]}u(He,"tileAt");function ct(t,r,e){return Em(He(t,r,e))}u(ct,"solidAt");var pe=1/120,qr=1e-6,Am=.22;function ut(t,r,e,i,n){for(let o=Math.floor(r);o<=Math.floor(i-qr);o++)for(let s=Math.floor(e);s<=Math.floor(n-qr);s++)if(ct(t,o,s))return!0;return!1}u(ut,"overlapsSolid");function Yr(t,r,e,i,n){return ut(t,r-i/2,e,r+i/2,e+n)}u(Yr,"boxBlocked");function vr(t,r,e=pe){let i={wallLeft:!1,wallRight:!1,landed:!1,bumped:null},n=r.w/2,o=r.x+r.vx*e;if(r.vx>0&&ut(t,o-n,r.y,o+n,r.y+r.h)){for(o=Math.floor(o+n-qr)-n;ut(t,o-n,r.y,o+n,r.y+r.h);)o-=1;r.vx=0,i.wallRight=!0}else if(r.vx<0&&ut(t,o-n,r.y,o+n,r.y+r.h)){for(o=Math.floor(o-n)+1+n;ut(t,o-n,r.y,o+n,r.y+r.h);)o+=1;r.vx=0,i.wallLeft=!0}r.x=o;let s=r.onGround,a=r.y+r.vy*e;if(r.onGround=!1,r.vy<=0)ut(t,r.x-n,a,r.x+n,a+r.h)?(a=Math.floor(a)+1,r.vy=0,r.onGround=!0,i.landed=!s):r.vy===0&&ut(t,r.x-n,a-.02,r.x+n,a)&&(r.onGround=!0);else if(ut(t,r.x-n,a,r.x+n,a+r.h)){let l=Math.floor(a+r.h-qr),c=Math.floor(r.x-n),d=Math.floor(r.x+n-qr),h=ct(t,c,l),m=ct(t,d,l);if(h!==m){let f=h?c+1-(r.x-n):d-(r.x+n);if(Math.abs(f)<=Am&&!ut(t,r.x+f-n,a,r.x+f+n,a+r.h))return r.x+=f,r.y=a,i}a=l-r.h,r.vy=0;let p=Math.floor(r.x),v=ct(t,p,l)?p:h?c:d;i.bumped={x:v,y:l}}return r.y=a,i}u(vr,"moveBody");var ae={width:.7,height:.9,walk:6,run:9.5,accel:32,airAccel:22,decel:38,turn:60,jump:18.3,jumpFromSpeed:.12,gravityHeld:40,gravityCut:120,gravityFall:75,maxFall:22,coyote:.1,buffer:.12},nl={left:!1,right:!1,jump:!1,jumpPressed:!1,run:!1};function ol(t,r){return{body:{x:t,y:r,w:ae.width,h:ae.height,vx:0,vy:0,onGround:!0},facing:1,airTime:0,bufferTime:1/0,jumping:!1,contacts:{wallLeft:!1,wallRight:!1,landed:!1,bumped:null},jumped:!1,riding:-1}}u(ol,"makeHero");function il(t,r,e,i){return t<r?Math.min(r,t+e*i):Math.max(r,t-e*i)}u(il,"approach");function sl(t,r,e,i=pe){let n=t.body,o=(r.right?1:0)-(r.left?1:0),s=r.run?ae.run:ae.walk;if(o!==0){t.facing=o;let l=n.vx*o<0,c=n.onGround?l?ae.turn:ae.accel:ae.airAccel,d=Math.abs(n.vx)>s&&n.vx*o>0?ae.decel*.5:c;n.vx=il(n.vx,o*s,d,i)}else n.vx=il(n.vx,0,n.onGround?ae.decel:ae.airAccel*.5,i);t.airTime=n.onGround?0:t.airTime+i,t.bufferTime=r.jumpPressed?0:t.bufferTime+i,t.jumped=!1,t.bufferTime<=ae.buffer&&t.airTime<=ae.coyote&&!t.jumping&&(n.vy=ae.jump+ae.jumpFromSpeed*Math.abs(n.vx),n.onGround=!1,t.jumping=!0,t.jumped=!0,t.airTime=ae.coyote+i,t.bufferTime=1/0);let a=n.vy>0?t.jumping&&r.jump?ae.gravityHeld:ae.gravityCut:ae.gravityFall;n.vy=Math.max(-ae.maxFall,n.vy-a*i),n.vy<=0&&(t.jumping=!1),t.contacts=vr(e,n,i),t.contacts.bumped&&(t.jumping=!1)}u(sl,"stepHero");function al(t){return t.body.y<-3}u(al,"fellOut");var gr={speed:2.4,thick:.45,fallDelay:.45,fallGravity:28};function ll(t){return t.map(r=>{let e=0,i=0;if(r.track&&r.track.to!==r.track.from){let n=r.track.to-r.track.from,o=r.track.axis==="x"?r.x:r.y,s=Math.min(1,Math.max(0,(o-r.track.from)/n));e=Math.acos(1-2*s),i=Math.PI*Math.abs(n)/gr.speed}return{spec:r,x:r.x,y:r.y,w:r.w,dx:0,dy:0,state:"still",time:0,vy:0,phase:e,period:i}})}u(ll,"makePlatforms");function Rm(t,r=pe){for(let e of t.platforms){let i=e.x,n=e.y;e.time+=r;let o=e.spec.track;if(e.state==="shake"&&e.time>=gr.fallDelay&&(e.state="fall",e.time=0),e.state==="fall")e.vy-=gr.fallGravity*r,e.y+=e.vy*r,e.y<-5&&(e.state="gone");else if(o&&e.period>0){let s=o.from+(o.to-o.from)*(1-Math.cos(e.phase+2*Math.PI*t.elapsed/e.period))/2;o.axis==="x"?e.x=s:e.y=s}e.dx=e.x-i,e.dy=e.y-n}}u(Rm,"movePlatforms");var Cm=u((t,r,e)=>t+r/2>e.x+.04&&t-r/2<e.x+e.w-.04,"overPlatform");function br(t,r,e,i=pe){let n=r.body,o=t.platforms.map(m=>m.y+1);t.elapsed+=i,Rm(t,i);let s=r.riding>=0?t.platforms[r.riding]:null;s&&(s.state==="gone"?r.riding=-1:(Yr(t.level,n.x+s.dx,n.y,n.w,n.h)||(n.x+=s.dx),Yr(t.level,n.x,s.y+1,n.w,n.h)?r.riding=-1:n.y=s.y+1));let a=r.riding,l=n.y;if(sl(r,e,t.level,i),r.riding=-1,n.vy>0)return!1;let c=-1,d=-1/0;if(t.platforms.forEach((m,p)=>{if(m.state==="gone"||!Cm(n.x,n.w,m))return;let v=m.y+1;l>=Math.min(o[p],v)-.02&&n.y<=v+1e-6&&v>d&&(c=p,d=v)}),c<0||n.onGround&&n.y>d)return!1;let h=t.platforms[c];return n.y=d,n.vy=0,n.onGround=!0,r.jumping=!1,r.riding=c,h.spec.kind==="fall"&&h.state==="still"&&(h.state="shake",h.time=0),a!==c}u(br,"stepHeroOnStage");function ns(t){return{level:t.level,platforms:t.platforms.map(r=>({...r})),elapsed:t.elapsed}}u(ns,"cloneStage");var Se={lives:3,time:300,coinsForLife:100,points:{coin:200,stomp:100,kick:400,timeLeft:10,big:2e3},bounce:10,bounceHeld:15,wakeAhead:2},le={big:{w:.95,h:1.5},hurtTime:2,starTime:8,rise:.6,battery:{speed:3},star:{speed:4,bounce:13},item:{w:.7,h:.7,gravity:40},spark:{w:.3,h:.3,speed:12,bounce:7,gravity:50,max:2,life:2.5},points:{item:1e3,brick:50,spark:200},flag:[[7.5,5e3],[6,2e3],[4,800],[2,400],[0,100]]},Pe={walker:{w:.8,h:.75,speed:2},shell:{w:.8,h:.9,speed:1.6,shellH:.6,slide:11},flyer:{w:.8,h:.7,bob:1.5,period:2.6},gravity:60,maxFall:20,kickGrace:.25},ul=3;function jr(t,r){let e=rl(t),i=r?.checkpoint??e.start,n=[],o=[],s=[],a=[];for(let l of e.things)if(l.kind==="coin")o.push({x:l.x,y:l.y+.5,taken:!1});else if(l.kind==="big")s.push({x:l.x,y:l.y+.5,taken:!1});else if(l.kind==="checkpoint")a.push({x:l.x,y:l.y});else{let c=Pe[l.kind];n.push({id:n.length,kind:l.kind,dir:-1,state:"asleep",time:0,home:{x:l.x,y:l.y},grace:0,body:{x:l.x,y:l.y,w:c.w,h:c.h,vx:0,vy:0,onGround:!1}})}return s.sort((l,c)=>l.x-c.x),s.forEach((l,c)=>{l.taken=!!r?.bigTaken?.[c]}),{spec:t,level:e,hero:ol(i.x,i.y),enemies:n,coins:o,bigCoins:s,platforms:ll(e.platforms),elapsed:0,checkpoints:a,checkpoint:r?.checkpoint??null,lives:r?.lives??Se.lives,coinCount:r?.coinCount??0,score:r?.score??0,time:Se.time,chain:0,power:"small",growing:!1,hurt:0,star:0,items:[],sparks:[],runHeld:!1,flag:null,dead:!1,cleared:!1,events:[]}}u(jr,"makeWorld");function ls(t){return t.lives<=0?null:jr(t.spec,{lives:t.lives,coinCount:t.coinCount,score:t.score,checkpoint:t.checkpoint,bigTaken:t.bigCoins.map(r=>r.taken)})}u(ls,"nextTry");var wn=u((t,r)=>Math.abs(t.x-r.x)<(t.w+r.w)/2&&t.y<r.y+r.h&&r.y<t.y+t.h,"overlap");function os(t,r){for(let e=0;e<r;e++)t.coinCount++,t.score+=Se.points.coin,t.coinCount%Se.coinsForLife===0&&(t.lives++,t.events.push({type:"oneUp",x:t.hero.body.x,y:t.hero.body.y}))}u(os,"addCoins");function as(t){t.dead||(t.dead=!0,t.lives--,t.events.push({type:"die",x:t.hero.body.x,y:t.hero.body.y}))}u(as,"die");function ss(t){let r=Math.min(1e3,Se.points.stomp*2**t.chain);return t.chain++,r}u(ss,"chainPoints");function $r(t,r,e){r.state="out",r.time=0,r.body.vy=9,r.body.vx=r.dir*1.5,t.score+=e,t.events.push({type:"knock",x:r.body.x,y:r.body.y,points:e,enemy:r.id})}u($r,"knock");function Lm(t,r){t.body.h=r?Pe.shell.shellH:Pe.shell.h}u(Lm,"setShellSize");function Xm(t,r,e){r.time+=e,r.grace=Math.max(0,r.grace-e);let i=r.body;if(r.state==="squashed"){r.time>.5&&(r.state="gone");return}if(r.state==="out"){i.vy-=Pe.gravity*e,i.x+=i.vx*e,i.y+=i.vy*e,i.y<-6&&(r.state="gone");return}if(r.kind==="flyer"){i.y=r.home.y+1+Math.sin(r.time/Pe.flyer.period*Math.PI*2)*Pe.flyer.bob,r.dir=t.hero.body.x<i.x?-1:1;return}let n=r.state==="slide"?Pe.shell.slide:r.state==="shell"?0:Pe[r.kind].speed;i.vx=r.dir*n,i.vy=Math.max(-Pe.maxFall,i.vy-Pe.gravity*e);let o=vr(t.level,i,e);(o.wallLeft||o.wallRight)&&(r.dir=-r.dir,r.state==="slide"&&t.events.push({type:"wall",x:i.x,y:i.y})),i.y<-3&&(r.state="gone")}u(Xm,"stepEnemy");function cs(t){let r=t.hero.body,e=t.power!=="small";if(e&&r.h<le.big.h){if(Yr(t.level,r.x,r.y,le.big.w,le.big.h)){t.growing=!0;return}r.w=le.big.w,r.h=le.big.h,t.growing=!1,t.events.push({type:"grow",x:r.x,y:r.y})}else e||(r.w=ae.width,r.h=ae.height,t.growing=!1)}u(cs,"fitHero");function cl(t){if(!(t.star>0||t.hurt>0||t.dead)){if(t.power==="small"){as(t);return}t.power="small",t.hurt=le.hurtTime,cs(t),t.events.push({type:"shrink",x:t.hero.body.x,y:t.hero.body.y})}}u(cl,"hurtHero");function Pm(t,r){r.state="gone",r.kind==="battery"?t.power==="small"&&(t.power="big"):r.kind==="thruster"?t.power="spark":t.star=le.starTime,cs(t),t.score+=le.points.item,t.events.push({type:"power",x:r.body.x,y:r.body.y,kind:r.kind,points:le.points.item})}u(Pm,"takeItem");function Dm(t,r,e){r.time+=e;let i=r.body;if(r.state==="rise"){i.y=r.fromY+Math.min(1,r.time/le.rise),r.time>=le.rise&&(r.state="move",r.time=0);return}if(r.kind==="thruster")return;i.vx=r.dir*(r.kind==="star"?le.star.speed:le.battery.speed),i.vy=Math.max(-Pe.maxFall,i.vy-le.item.gravity*e);let n=vr(t.level,i,e);(n.wallLeft||n.wallRight)&&(r.dir=-r.dir),r.kind==="star"&&n.landed&&(i.vy=le.star.bounce),i.y<-3&&(r.state="gone")}u(Dm,"stepItem");function Bm(t){let r=t.hero.body;if(t.sparks.filter(n=>!n.gone).length>=le.spark.max)return;let e=le.spark,i=t.hero.facing;t.sparks.push({dir:i,time:0,gone:!1,body:{x:r.x+i*(r.w/2),y:r.y+r.h*.45,w:e.w,h:e.h,vx:i*e.speed,vy:-2,onGround:!1}}),t.events.push({type:"shoot",x:r.x,y:r.y+r.h*.45})}u(Bm,"shoot");function Im(t,r,e,i){let n=le.spark,o=r.body;r.time+=i,o.vx=r.dir*n.speed,o.vy=Math.max(-Pe.maxFall,o.vy-n.gravity*i);let s=vr(t.level,o,i);if(s.landed&&(o.vy=n.bounce),s.wallLeft||s.wallRight||r.time>n.life||o.y<-2||o.x>e+1){r.gone=!0,(s.wallLeft||s.wallRight)&&t.events.push({type:"fizzle",x:o.x,y:o.y});return}for(let a of t.enemies)if(!(a.state!=="walk"&&a.state!=="shell"&&a.state!=="slide")&&wn(o,a.body)){a.dir=r.dir,$r(t,a,le.points.spark),r.gone=!0;return}}u(Im,"stepSpark");var km=u((t,r,e)=>Math.abs(t.y-(e+1))<.05&&t.x+t.w/2>r&&t.x-t.w/2<r+1,"standsOn");function us(t,r,e,i=pe){if(t.events=[],t.dead||t.cleared)return;let n=t.hero,o=n.body,s=o.y;if(t.time-=i,t.time<=0){t.time=0,as(t);return}t.hurt=Math.max(0,t.hurt-i),t.star=Math.max(0,t.star-i);let a=br(t,n,r,i);t.growing&&cs(t),t.power==="spark"&&r.run&&!t.runHeld&&Bm(t),t.runHeld=r.run,n.jumped&&t.events.push({type:"jump",x:o.x,y:o.y}),(n.contacts.landed||a)&&t.events.push({type:"land",x:o.x,y:o.y}),o.onGround&&(t.chain=0);let l=n.contacts.bumped;if(l){let c=He(t.level,l.x,l.y);if(t.events.push({type:"bump",x:l.x,y:l.y,tile:c}),c==="bonus")t.level.tiles[l.x][l.y]="used",os(t,1),t.events.push({type:"coin",x:l.x+.5,y:l.y+1,fromBlock:!0});else if(c==="power"||c==="star"){t.level.tiles[l.x][l.y]="used";let d=c==="star"?"star":t.power==="small"?"battery":"thruster",h=t.items.length,m=le.item;t.items.push({id:h,kind:d,dir:1,state:"rise",time:0,fromY:l.y,body:{x:l.x+.5,y:l.y,w:m.w,h:m.h,vx:0,vy:0,onGround:!1}}),t.events.push({type:"item",x:l.x+.5,y:l.y+1,kind:d,id:h})}else c==="brick"&&t.power!=="small"&&(t.level.tiles[l.x][l.y]="empty",t.score+=le.points.brick,t.events.push({type:"break",x:l.x,y:l.y,points:le.points.brick}));if(c==="bonus"||c==="brick"||c==="used"||c==="power"||c==="star"){for(let d of t.enemies)(d.state==="walk"||d.state==="shell")&&km(d.body,l.x,l.y)&&$r(t,d,Se.points.stomp);for(let d of t.coins)!d.taken&&Math.floor(d.x)===l.x&&Math.floor(d.y)===l.y+1&&(d.taken=!0,os(t,1),t.events.push({type:"coin",x:d.x,y:d.y,fromBlock:!0}))}}for(let c of t.coins)c.taken||Math.abs(c.x-o.x)<o.w/2+.3&&c.y>o.y-.3&&c.y<o.y+o.h+.3&&(c.taken=!0,os(t,1),t.events.push({type:"coin",x:c.x,y:c.y,fromBlock:!1}));t.bigCoins.forEach((c,d)=>{c.taken||Math.abs(c.x-o.x)<o.w/2+.5&&c.y>o.y-.5&&c.y<o.y+o.h+.5&&(c.taken=!0,t.score+=Se.points.big,t.events.push({type:"big",x:c.x,y:c.y,index:d,points:Se.points.big}))});for(let c of t.items){if(c.state==="gone")continue;Dm(t,c,i);let d=c.state;d!=="gone"&&(d==="move"||c.time>le.rise*.5)&&wn(o,c.body)&&Pm(t,c)}for(let c of t.sparks)c.gone||Im(t,c,e,i);t.sparks=t.sparks.filter(c=>!c.gone);for(let c=Math.floor(o.x-o.w/2);c<=Math.floor(o.x+o.w/2-1e-6);c++)for(let d=Math.floor(o.y);d<=Math.floor(o.y+o.h-1e-6);d++)if(He(t.level,c,d)==="spikes"&&o.y<d+.55&&(cl(t),t.dead))return;for(let c of t.enemies){if(c.state==="asleep")if(c.body.x-c.body.w/2<e+Se.wakeAhead)c.state="walk",c.time=0;else continue;c.state!=="gone"&&Xm(t,c,i)}for(let c of t.enemies)if(c.state==="slide")for(let d of t.enemies)d===c||d.state!=="walk"&&d.state!=="shell"&&d.state!=="slide"||wn(c.body,d.body)&&(d.dir=c.dir,$r(t,d,ss(t)));for(let c of t.enemies){if(c.state!=="walk"&&c.state!=="shell"&&c.state!=="slide"||!wn(o,c.body))continue;if(t.star>0){c.dir=o.x<c.body.x?1:-1,$r(t,c,ss(t));continue}if(o.vy<=0&&s>=c.body.y+c.body.h*.45){let h=c.state==="shell"?Se.points.kick:ss(t);c.kind==="walker"?(c.state="squashed",c.time=0):c.kind==="flyer"?$r(t,c,0):c.state==="walk"||c.state==="slide"?(c.state="shell",c.time=0,Lm(c,!0)):(c.state="slide",c.dir=o.x<c.body.x?1:-1,c.grace=Pe.kickGrace),o.y=Math.max(o.y,c.body.y+c.body.h),o.vy=r.jump?Se.bounceHeld:Se.bounce,n.jumping=r.jump,t.score+=h,t.events.push({type:c.state==="slide"?"kick":"stomp",x:c.body.x,y:c.body.y+c.body.h,points:h,enemy:c.id});continue}if(c.state==="shell"){c.state="slide",c.dir=o.x<c.body.x?1:-1,c.grace=Pe.kickGrace,t.score+=Se.points.kick,t.events.push({type:"kick",x:c.body.x,y:c.body.y,points:Se.points.kick,enemy:c.id});continue}if(!(c.grace>0)&&(cl(t),t.dead))return}for(let c of t.checkpoints)o.x>=c.x&&(!t.checkpoint||t.checkpoint.x<c.x)&&(t.checkpoint=c,t.events.push({type:"checkpoint",x:c.x,y:c.y}));if(al(n)){as(t);return}if(o.x+o.w/2>=t.level.goal.x-.5){t.cleared=!0;let c=Math.max(0,o.y-t.level.goal.y),d=le.flag.find(([h])=>c>=h)[1];t.flag={height:c,points:d},t.score+=d+Math.ceil(t.time)*Se.points.timeLeft,t.events.push({type:"clear",x:o.x,y:o.y,height:c,points:d})}}u(us,"stepWorld");function Mn(){return{held:-1,run:!0,hold:.5}}u(Mn,"makeBot");var Fm=[{run:!0,hold:.5},{run:!1,hold:.5},{run:!0,hold:.2},{run:!1,hold:.2}],dl={run:!1,hold:-1},ml=u(t=>({...t,body:{...t.body},contacts:{...t.contacts}}),"copyHero");function Kr(t,r,e){let i=Math.floor(e+.01),n=Math.floor(r);for(let o of[i,i-1,i-2]){if(He(t.level,n,o)==="spikes")return!1;if(o<i&&ct(t.level,n,o))return!0}return t.platforms.some(o=>o.state!=="gone"&&o.state!=="fall"&&r>o.x&&r<o.x+o.w&&o.y+1<=e+.1&&o.y+1>=e-2)}u(Kr,"groundAt");function pl(t,r){let e=r.body;if(Tn(t,r))return!1;if(r.riding>=0&&t.platforms[r.riding].spec.kind==="fall")return!0;let i=e.y;for(let n=0;n<90;n++)if(br(t,r,nl,pe),e.y<i-.5||Tn(t,r))return!1;return Kr(t,e.x,e.y)}u(pl,"safeLanding");function Tn(t,r){let e=r.body;for(let i=Math.floor(e.x-e.w/2);i<=Math.floor(e.x+e.w/2-1e-6);i++)for(let n=Math.floor(e.y);n<=Math.floor(e.y+e.h-1e-6);n++)if(He(t.level,i,n)==="spikes"&&e.y<n+.55)return!0;return!1}u(Tn,"onSpikes");function hl(t,r,e){let i=ns(t),n=ml(t.hero);for(let o=0;o<360;o++){let s=o*pe;if(br(i,n,{left:!1,right:!0,run:r,jump:s<e,jumpPressed:e>=0&&o===0},pe),n.body.y<-1||Tn(i,n))return!1;if(o>2&&n.body.onGround)return pl(i,n)}return!0}u(hl,"safeJump");function Nm(t){let r=ns(t),e=ml(t.hero),i=-1;for(let n=0;n<480;n++){let o=e.body,s=i<0&&o.onGround&&!Kr(r,o.x+o.w/2+.3,o.y);s&&(i=n);let a=i>=0&&(n-i)*pe<.5;if(br(r,e,{left:!1,right:!0,run:!0,jump:a,jumpPressed:s},pe),o.y<-1||Tn(r,e))return!1;if(i>=0&&n-i>2&&o.onGround)return pl(r,e)}return!0}u(Nm,"safeRunUp");function fl(t,r,e){let i=r.hero.body,n=i.x+i.w/2,o=Math.floor(i.y+.01),s=!1,a=!1;if(i.onGround){for(let m=.05;m<=1.5&&!s;m+=.25){let p=Math.floor(n+m);(ct(r.level,p,o)||ct(r.level,p,o+1))&&(s=!0),m<1&&He(r.level,p,o)==="spikes"&&(s=!0)}Kr(r,n+(Math.abs(i.vx)<1?.8:.3),i.y)||(s=!0),r.hero.riding>=0&&r.platforms[r.hero.riding].spec.kind==="fall"&&(s=!0),a=s;for(let m of r.enemies){if(m.state!=="walk"&&m.state!=="slide"&&m.state!=="shell")continue;let p=m.body.x-m.body.w/2-n;p>0&&p<2.4&&m.body.y<i.y+i.h+.5&&m.body.y+m.body.h>i.y-.2&&(s=!0)}}let l=!1,c=!1;if(s&&t.held<0){let m=Fm.find(p=>hl(r,p.run,p.hold));m?(l=!0,t.run=m.run,t.hold=m.hold):hl(r,dl.run,dl.hold)&&(t.run=!1,c=!0)}let d=!1;if(i.onGround&&!l&&t.held<0)if(t.run=!0,c)t.run=!1;else if(a)d=!0;else{let m=i.vx*i.vx/(2*ae.decel)+.6;for(let p=.3;p<=m&&!d&&(Kr(r,n+p,i.y)||(d=!Nm(r)),!!Kr(r,n+p,i.y));p+=.25);}l?t.held=0:t.held>=0&&(t.held+=e);let h=t.held>=0&&t.held<t.hold;return(t.held>.5||t.held>.05&&i.vy<=0&&i.onGround)&&(t.held=-1),{left:!1,right:!d,run:t.run,jump:h,jumpPressed:l}}u(fl,"botInput");var Ee={deadZone:1.2,lead:3,leadSpeed:9.5,above:2.4,followX:6,followY:3,climb:0,bandY:3.5,ahead:3.25,aheadShare:1.3,deadZoneShare:.3};function Um(t){return Math.min(Ee.ahead,t*Ee.aheadShare)}u(Um,"aheadFor");function vl(t,r,e){let i=Math.max(t,e);return{x:i,y:r+Ee.above,lead:0,minX:i,goalY:r+Ee.above}}u(vl,"makeCamera");function ds(t,r,e,i,n,o=-1/0,s=1/0,a=.9,l=!1){let c=Math.max(-1,Math.min(1,r.vx/Ee.leadSpeed))*Ee.lead;t.lead+=(c-t.lead)*(1-Math.exp(-n*2));let d=r.x+t.lead,h=Math.min(Ee.deadZone,e*Ee.deadZoneShare),m=t.x;d>t.x+h?m=d-h:d<t.x-h&&(m=d+h),t.x+=(m-t.x)*(1-Math.exp(-n*Ee.followX)),t.x=Math.max(t.x,r.x+Um(e)-e);let p=Math.max(e,i-e);l&&(t.minX=Math.min(t.minX,t.x)),t.minX=Math.max(t.minX,Math.min(t.x,p)),t.x=Math.min(p,Math.max(t.minX,e,t.x));let v=Math.max(o,r.y+Ee.climb);(r.onGround||Math.abs(v-t.goalY)>Ee.bandY)&&(t.goalY=v),t.y+=(t.goalY-t.y)*(1-Math.exp(-n*Ee.followY));let f=r.y+a-(t.y+s);f>0&&(t.y+=f,t.goalY=Math.max(t.goalY,t.y))}u(ds,"followHero");var gl={ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right",Space:"jump",ArrowUp:"jump",KeyW:"jump",KeyK:"jump",ShiftLeft:"run",ShiftRight:"run",KeyJ:"run"},hs=class hs{constructor(r=()=>{}){this.onAnyInput=r;this.keys=new Set;this.touch=new Map;this.pressed=!1;this.override=null;window.addEventListener("keydown",e=>{let i=gl[e.code];i&&(e.preventDefault(),this.onAnyInput(),i==="jump"&&!e.repeat&&!this.held("jump")&&(this.pressed=!0),this.keys.add(e.code))}),window.addEventListener("keyup",e=>this.keys.delete(e.code)),window.addEventListener("blur",()=>{this.keys.clear(),this.touch.clear()})}bindTouch(r,e,i){let n=u(d=>{let h=r.getBoundingClientRect();return d.clientX<h.left+h.width/2?"left":"right"},"padSide");r.addEventListener("pointerdown",d=>{d.preventDefault(),r.setPointerCapture(d.pointerId),this.onAnyInput();let h=n(d);r.dataset.side=h,this.touch.set(d.pointerId,[h])}),r.addEventListener("pointermove",d=>{if(!this.touch.has(d.pointerId))return;let h=n(d);r.dataset.side=h,this.touch.set(d.pointerId,[h])});let o=u(d=>{this.touch.delete(d.pointerId),delete r.dataset.side},"padUp");r.addEventListener("pointerup",o),r.addEventListener("pointercancel",o);let s=10,a=u(d=>{for(let[h,m]of[[e,"jump"],[i,"run"]]){let p=h.getBoundingClientRect();if(d.clientX>=p.left-s&&d.clientX<=p.right+s&&d.clientY>=p.top-s&&d.clientY<=p.bottom+s)return m}return null},"over"),l=new Map,c=u(d=>{let h=a(d),m=this.touch.get(d.pointerId)??[],p=[];(h==="run"||l.get(d.pointerId))&&p.push("run"),h==="jump"&&(!m.includes("jump")&&!this.held("jump")&&(this.pressed=!0),p.push("jump")),this.touch.set(d.pointerId,p),this.showButtons(e,i)},"update");for(let d of[e,i]){d.addEventListener("pointerdown",m=>{m.preventDefault(),d.setPointerCapture(m.pointerId),this.onAnyInput(),l.set(m.pointerId,d===i),c(m)}),d.addEventListener("pointermove",m=>{this.touch.has(m.pointerId)&&c(m)});let h=u(m=>{this.touch.delete(m.pointerId),l.delete(m.pointerId),this.showButtons(e,i)},"up");d.addEventListener("pointerup",h),d.addEventListener("pointercancel",h)}}showButtons(r,e){r.classList.toggle("down",this.held("jump")),e.classList.toggle("down",this.held("run"))}held(r){for(let e of this.keys)if(gl[e]===r)return!0;for(let e of this.touch.values())if(e.includes(r))return!0;return!1}read(){if(this.override){let e={...this.override};return this.override.jumpPressed=!1,e}let r={left:this.held("left"),right:this.held("right"),jump:this.held("jump")||this.pressed,jumpPressed:this.pressed,run:this.held("run")};return this.pressed=!1,r}clear(){this.keys.clear(),this.touch.clear(),this.pressed=!1}};u(hs,"Controls");var Sn=hs;var ms=16;function dt(t,r,...e){let i=Array(ms).fill("");for(let n of e){let o=n.split(`
`).map(l=>l.trim()).filter(l=>l.length);if(o.length>ms)throw new Error(`${t}: a piece is ${o.length} rows high`);let s=Math.max(...o.map(l=>l.length));[...Array(ms-o.length).fill(""),...o].map(l=>l.padEnd(s,".")).forEach((l,c)=>{i[c]+=l})}return{name:t,theme:r,rows:i}}u(dt,"level");var ht=`
  ..........XX
  .........XXX
  ........XXXX
  .......XXXXX
  ......XXXXXX
  .....XXXXXXX........F.....
  ##########################
  ##########################`,Om=dt("Prado 1 \xB7 Primeiros passos","meadow",`
  ..........B!B?B...
  ..................
  ..................
  ..................
  ...S..............
  ##################
  ##################`,`
  .............oooo.......X......
  ........................X......
  ...........X..........X.X......
  .......X...X.....g....X.X...g..
  ###############################
  ###############################`,`
  .......$.............
  .....................
  .....................
  .....................
  ......===............
  ..............o.o.o..
  ##..........#########
  ##..........#########`,`
  ...........B?B?B.........
  .........................
  .........................
  .......................XX
  .......k..............XXX
  ######################XXX
  ######################XXX`,`
  ..................oooo.........
  .....----===----...............
  ......................C........
  ##.................############
  ##.................############`,`
  ..BB$BB.................................
  ..BBBBB.................................
  ........................................
  ........................................
  ...B?B!B................X...............
  ........................X......X........
  ..................g..g..X......X.oooo...
  ########################################
  ########################################`,`
  ........ooo........
  .......~~~~~.......
  ...................
  ...................
  ...................
  ##.................##
  ##.................##`,`
  ...........$.....
  .........XXXXX...
  .................
  .................
  .................
  .....XX.....g....
  #################
  #################`,ht),zm=dt("Prado 2 \xB7 Colinas","meadow",`
  ..................
  ..................
  ...S..............
  ##################
  ##################`,`
  ..............ooo.........
  .............XXXXX........
  ...........XXXXXXXXX......
  .........XXXXXXXXXXXXX....
  ..g.....XXXXXXXXXXXXXXX...
  ##########################
  ##########################`,`
  .....oo.....oo.....oo.....
  ....~~~~...~~~~...~~~~....
  ..........................
  ##......................##
  ##......................##`,`
  ..........$...........
  ..........X...........
  ......................
  ......................
  .......B!B?B..........
  ......................
  ......................
  ...k..........g...g...
  ######################
  ######################`,`
  .........oooo...........
  ......----====----......
  ........................
  ##....................##
  ##....................##`,`
  ...........................
  ........XXX......XXX.......
  .....C..XXX^^^^^^XXX...v...
  ###########################
  ###########################`,`
  .$..........................
  .~~~........................
  ............................
  ............................
  ......~~~....~~~....~~~.....
  ............................
  ##........................##
  ##........................##`,`
  ...........................
  ....BBBBBBB................
  ...........................
  ...........................
  ....B?B*B?B................
  ...........................
  ...........................
  ........g..g..g.......k....
  ###########################
  ###########################`,`
  ........$......
  ....|..XXX.....
  ....|..........
  ....|..........
  ....|..........
  ....|..........
  ....|.XXXXXXXX.
  ....|.XXXXXXXX.
  ....|.XXXXXXXX.
  ....|.XXXXXXXX.
  ....|.XXXXXXXX.
  ###===XXXXXXXX#
  ###...XXXXXXXX#`,`
  ..........
  ##########
  ##########`,ht),Gm=dt("Prado 3 \xB7 Rio das Pedras","meadow",`
  .........?............
  ......................
  ......................
  ...S.............k....
  ######################
  ######################`,`
  .................oo............
  ...oo..........----====-----...
  ..----====---..................
  ...............................
  ##.............................
  ##.............................`,`
  ............................
  ............................
  ............................
  ...........B!B..............
  ............................
  ............................
  ..........g...g....g........
  ############################
  ############################`,`
  ........$............
  ......XXXXX..........
  .....................
  .....................
  ...~~~..~~~..~~~.....
  .....................
  ##.................##
  ##.................##`,`
  .......XX....XX....XX.........
  .....C.XX^^^^XX^^^^XX...k.....
  ##############################
  ##############################`,`
  .........oooo........
  ....|...XXXXXX.......
  ....|................
  ....|................
  ....|................
  ....|................
  ....|................
  ....|................
  ....|................
  ....|................
  ##.===.............##
  ##.................##`,`
  .................................
  .........BB$BB...................
  .........BBBBB...................
  .................................
  .................................
  .........B?B?B......X............
  ....................X............
  ..............v.....X.....g......
  #################################
  #################################`,`
  ..........ooo..........
  .....----=====-------..
  .......................
  ##.....................##
  ##.....................##`,`
  .......$...........
  ......XXX..........
  ...................
  ...................
  .............g.....
  ###################
  ###################`,ht),de=u(t=>Array.from({length:3},()=>"X".repeat(t)).join(`
`),"roof"),Vm=dt("Cavernas 1 \xB7 Entrada","caves",`
  ${de(20)}
  ....................
  ....................
  ....................
  ....................
  ....................
  .........?.B!B......
  ....................
  ....................
  ...S................
  ####################
  ####################`,`
  ${de(30)}
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  .........X........X.....$X....
  ....g....X...^^...X.....XX....
  ##############################
  ##############################`,`
  ${de(26)}
  ..........................
  ..........................
  ..........................
  ..........................
  ..........................
  ..........oooo............
  ..........................
  ......~~~......~~~........
  ..........................
  ##......................##
  ##......................##`,`
  ${de(28)}
  ............................
  ............................
  ............................
  ............................
  ............................
  ........BBBBB...............
  ........B?B?B...............
  ............................
  ...C..k........g..........g.
  ############################
  ############################`,`
  ${de(24)}
  ........................
  ........................
  .........$..............
  ........................
  ........................
  ........................
  ......-----===----......
  ........................
  ........................
  ##....................##
  ##....................##`,`
  ${de(30)}
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  ...................$..........
  .....XX....XX....XX...........
  .....XX....XX....XX...........
  .....XX^^^^XX^^^^XX...........
  ##############################
  ##############################`,ht),Wm=dt("Cavernas 2 \xB7 Po\xE7o de Ametista","caves",`
  ${de(18)}
  ..................
  ..................
  ..................
  ..................
  ..................
  ..................
  ..................
  ..................
  ...S..............
  ##################
  ##################`,`
  ${de(22)}
  ......................
  ......................
  ...........$..........
  ......|....XXXXXXXXX..
  ......|...............
  ......|...............
  ......|...............
  ......|...............
  ......|...............
  ##...===...###########
  ##.........###########`,`
  ${de(24)}
  ........................
  ........................
  ........................
  ........................
  ........................
  ........................
  ...........oooo.........
  ........................
  ......................g.
  ########################
  ########################`,`
  ${de(28)}
  ............................
  ............................
  ............................
  ............................
  ............................
  ............................
  ............................
  ....~~~...~~~...~~~...~~~...
  ............................
  ##........................##
  ##........................##`,`
  ${de(26)}
  ..........................
  ..........................
  ..........................
  ..........................
  ..........................
  .......B!B?B..............
  ..........................
  ..........................
  ...C.....k.......g...g....
  ##########################
  ##########################`,`
  ${de(24)}
  ........................
  ........................
  ........................
  ...........$............
  .........XXXXX..........
  ........................
  ........................
  ........................
  ....XXX^^^XXX^^^XXX.....
  ########################
  ########################`,`
  ${de(26)}
  ..........................
  ..........................
  ..........................
  ..........................
  ..........................
  ..........................
  ..........................
  ......-----=====-----.....
  ..........................
  ##......................##
  ##......................##`,`
  ${de(26)}
  ..........................
  ..........................
  ..........................
  .......BB$BB..............
  .......BBBBB..............
  ..........................
  .......B?B?B..............
  ..........................
  .....................g....
  ##########################
  ##########################`,ht),Hm=dt("Cavernas 3 \xB7 Cora\xE7\xE3o de Cristal","caves",`
  ${de(20)}
  ....................
  ....................
  ....................
  ....................
  ....................
  ......B!B...........
  ....................
  ....................
  ...S................
  ####################
  ####################`,`
  ${de(24)}
  ........................
  ........................
  ........................
  ........................
  ........................
  ........................
  ........................
  ..~~~..~~~..~~~..~~~....
  ........................
  ##....................##
  ##....................##`,`
  ${de(30)}
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  .......XX.........XX..........
  .......XX.........XX..........
  ...g...XX..^^^^...XX...k......
  ##############################
  ##############################`,`
  ${de(26)}
  ..........................
  ..........................
  ..........................
  .........$................
  ........XXX...............
  ..........................
  ..........................
  ....----===----------.....
  ..........................
  ##......................##
  ##......................##`,`
  ${de(24)}
  ........................
  ........................
  ........................
  ........................
  ......B?B*B?B...........
  ........................
  ........................
  ........................
  ...C..g..g......g.......
  ########################
  ########################`,`
  ${de(22)}
  ......................
  ......................
  ...........$..........
  .....|..XXXXXXXXXXX...
  .....|..X.............
  .....|..X.............
  .....|..X.............
  .....|..X.............
  .....|..X.............
  ##..===.X...........##
  ##......X...........##`,`
  ${de(22)}
  ......................
  ......................
  ......................
  ......................
  ...........$..........
  ......................
  ......................
  ..~~~...~~~...~~~.....
  ......................
  ##..................##
  ##..................##`,`
  ${de(24)}
  ........................
  ........................
  ........................
  ........................
  ........................
  ......ooo...............
  .....XXXXX..............
  ........................
  ..........g.......g.....
  ########################
  ########################`,ht),Jm=dt("Nuvens 1 \xB7 Cais A\xE9reo","clouds",`
  ...................
  ..........B!B?B....
  ...................
  ...................
  ...S...............
  XXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXX`,`
  ...oooo..................
  .----====--------........
  .........................
  ...................XXXXXX
  ...................XXXXXX`,`
  ......$..................
  .........................
  .........................
  ......XX.................
  .........................
  ...g.........g..........k
  XXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXX`,`
  ...........................
  ....~~~....~~~....~~~......
  ...........................
  XX.......................XX
  XX.......................XX`,`
  .........................
  .........................
  .........................
  .......B?B?B.............
  .........................
  .........................
  ..C..v.........g.....g...
  XXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXX`,`
  .......................
  ..........$............
  ......|..XXXXXXXXXXXXXX
  ......|................
  ......|................
  ......|................
  ......|................
  ......|................
  ....===................
  .......................`,`
  ......................
  ...BBBBB..............
  ...BB$BB..............
  ......................
  ...B?B?B..............
  ......................
  ......................
  .............g........
  XXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXX`,ht.replace(/#/g,"X")),qm=dt("Nuvens 2 \xB7 Linha de Montagem","clouds",`
  ...................
  ...S...............
  XXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXX`,`
  .oo...................oo.......
  ..................-------===...
  .===----------.................
  ...............................
  ...............................
  ...............................`,`
  ..........................
  ......B!B?B...............
  ..........................
  ..........................
  ..........................
  ..k........g.....g........
  XXXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXXX`,`
  ............$...............
  ...........XXX..............
  ............................
  ............................
  ...~~...~~...~~...~~..~~....
  ............................
  ............................
  ............................`,`
  ........................
  ..C.......X^^^X...g.....
  XXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXX`,`
  .......................
  ...........$...........
  ....|..XXXXXXXXXX......
  ....|..................
  ....|..................
  ....|..................
  ....|..................
  ....|..................
  ...===.................
  .......................`,`
  .............................
  .......B?B*B?B...............
  .............................
  .............................
  .............................
  ................g.........g..
  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX`,`
  ...............ooo........
  ..-------=====---------...
  ..........................
  ....................$.....
  ...................XXX....`,ht.replace(/#/g,"X")),Ym=dt("Nuvens 3 \xB7 Torre do Vento","clouds",`
  ...................
  ........B!B........
  ...................
  ...................
  ...................
  ...S...............
  XXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXX`,`
  ...........................
  ..~~..~~..~~..~~..~~..~~...
  ...........................
  ...........................
  ...........................`,`
  ..........................
  ..........................
  ........g.....v.......g...
  XXXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXXX`,`
  ...$.....................
  ..XXX....................
  .........................
  .........................
  ..----===-------------...
  .........................
  .........................
  .........................`,`
  ............................
  ......B?B*B?B...............
  ............................
  ............................
  ............................
  ..C....g..g.........X^^X....
  XXXXXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXXXXX`,`
  ............................
  ...........$................
  ......|..XXXXXXXXXXXXX......
  ......|.....................
  ......|.....................
  ......|.....................
  ......|.....................
  ......|.....................
  ......|.....................
  ......|.................XXXX
  ......|.................XXXX
  ....===.................XXXX
  ........................XXXX`,`
  ........................
  ..~~~...~~~...~~~...~~~.
  ........................
  ........................
  ........................`,`
  .........................
  ..BBBBB..................
  ..BB$BB..................
  .........................
  ..B?B?B..................
  .........................
  .........................
  .........g.....g.........
  XXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXX`,ht.replace(/#/g,"X")),ps=[{name:"Prado Verde",theme:"meadow",levels:[Om,zm,Gm]},{name:"Cavernas de Cristal",theme:"caves",levels:[Vm,Wm,Hm]},{name:"F\xE1brica nas Nuvens",theme:"clouds",levels:[Jm,qm,Ym]}],Jt=ps.flatMap(t=>t.levels);var qt={meadow:{sky:["#3d8ff0","#9fd2ff","#e4f4ff"],clear:[.6,.82,1],top:["#5fbf3c","#74d24c","#4aa22e"],earth:["#7a5130","#8c6038","#69452a"],deep:[.36,.23,.14],block:["#8f96a8","#b4bccd","#656b7a","#7d8496"],blockMark:null,ambient:[.55,.58,.66],sun:[1,.96,.88],scenery:"hills",far:[.48,.72,.62],near:[.36,.7,.38],mover:[.95,.75,.2],faller:[.78,.5,.3],page:"#9fd2ff"},caves:{sky:["#000000","#04020b","#0c0619"],clear:[.08,.05,.15],top:["#3fd6c8","#8ff5ea","#259a92"],earth:["#3b2f55","#4a3c69","#2c2340"],deep:[.16,.12,.24],block:["#6a4fa3","#957ad0","#432f6e","#5a4290"],blockMark:"#c9a8ff",ambient:[.42,.36,.6],sun:[.7,.75,1],scenery:"crystals",far:[.42,.22,.75],near:[.16,.7,.68],mover:[.35,.9,.85],faller:[.62,.42,.85],page:"#1f1238"},clouds:{sky:["#ff7e6b","#ffb88a","#ffe9c7"],clear:[1,.8,.65],top:["#9aa6ba","#c3ccdb","#6e7a8e"],earth:["#59637a","#6a758e","#475066"],deep:[.95,.9,.92],block:["#8e9bb3","#c0cadb","#5d6880","#f2b134"],blockMark:"#3a4152",ambient:[.66,.58,.6],sun:[1,.86,.72],scenery:"clouds",far:[.98,.93,.95],near:[1,1,1],mover:[.95,.6,.2],faller:[.85,.85,.9],page:"#ffb88a"}};var _l=[{name:"Hips",parent:null,offset:[0,.2,0]},{name:"Body",parent:"Hips",offset:[0,0,0]},{name:"Antenna",parent:"Body",offset:[0,.64,0]},{name:"ArmR",parent:"Body",offset:[.4,.25,0]},{name:"HandR",parent:"ArmR",offset:[0,-.2,0]},{name:"ArmL",parent:"Body",offset:[-.4,.25,0]},{name:"HandL",parent:"ArmL",offset:[0,-.2,0]},{name:"LegR",parent:"Hips",offset:[.14,0,0]},{name:"FootR",parent:"LegR",offset:[0,-.15,0]},{name:"LegL",parent:"Hips",offset:[-.14,0,0]},{name:"FootL",parent:"LegL",offset:[0,-.15,0]}],An={Idle:!0,Run:!0,Jump:!1,Fall:!1,Die:!1,Victory:!0},$m=6;function wl(t="Bit"){let r=new xe(t),e=new Map;for(let n of _l){let o=new xe(n.name);o.transform.setParent((n.parent?e.get(n.parent):r).transform),o.transform.setLocalPosition(n.offset[0],n.offset[1],n.offset[2]),e.set(n.name,o)}let i=new Ht;i.playOnStart=!1,r.addBehaviour(i);for(let n of rp())i.addClip(n);return{root:r,bones:e,animator:i}}u(wl,"buildBit");var En={ArmR:[0,0,.35],ArmL:[0,0,-.35]},jm=[{t:0,hips:[0,.2,0],rot:{...En,Antenna:[0,0,.08]}},{t:.8,hips:[0,.185,0],rot:{ArmR:[0,0,.45],ArmL:[0,0,-.45],Body:[.03,0,0],Antenna:[0,0,-.08]}},{t:1.6,hips:[0,.2,0],rot:{...En,Antenna:[0,0,.08]}}],fs=u((t,r)=>({t:r,hips:[0,.2,0],rot:{Body:[.18,0,0],Antenna:[.35,0,0],LegR:[-.85*t,0,0],FootR:[.3*t,0,0],LegL:[.85*t,0,0],FootL:[-.3*t,0,0],ArmR:[.9*t,0,.4],ArmL:[-.9*t,0,-.4]}}),"stride"),bl=u(t=>({t,hips:[0,.25,0],rot:{Body:[.16,0,0],Antenna:[.25,0,0],LegR:[0,0,0],FootR:[.4,0,0],LegL:[0,0,0],FootL:[.4,0,0],ArmR:[0,0,.4],ArmL:[0,0,-.4]}}),"passing"),Km=[fs(1,0),bl(.125),fs(-1,.25),bl(.375),fs(1,.5)],Tl={Body:[-.1,0,0],Antenna:[-.4,0,0],ArmR:[-.3,0,2.3],ArmL:[-.3,0,-2.3],HandR:[0,0,.3],HandL:[0,0,-.3],LegR:[-.7,0,0],FootR:[1.1,0,0],LegL:[-.3,0,0],FootL:[.8,0,0]},Qm=[{t:0,hips:[0,.2,0],rot:En},{t:.15,hips:[0,.22,0],rot:Tl}],Zm=[{t:0,hips:[0,.22,0],rot:Tl},{t:.3,hips:[0,.2,0],rot:{Body:[.05,0,0],Antenna:[-.6,0,0],ArmR:[0,0,1.35],ArmL:[0,0,-1.35],HandR:[0,0,-.4],HandL:[0,0,.4],LegR:[.2,0,.12],LegL:[-.2,0,-.12],FootR:[-.2,0,0],FootL:[.2,0,0]}}],ep=[{t:0,hips:[0,.2,0],rot:En},{t:.2,hips:[0,.2,0],rot:{Body:[-.25,0,0],Antenna:[-.8,0,.5],ArmR:[0,0,2.8],ArmL:[0,0,-2.8],LegR:[0,0,.4],LegL:[0,0,-.4]}}],vs=u((t,r)=>({t,hips:[0,r?.32:.2,0],rot:{Body:[-.08,0,0],Antenna:[r?-.3:.2,0,0],ArmR:[0,0,r?2.9:2.4],HandR:[0,0,r?.5:-.4],ArmL:[0,0,-.3],LegR:r?[-.5,0,0]:[0,0,0],FootR:r?[.7,0,0]:[0,0,0],LegL:r?[-.5,0,0]:[0,0,0],FootL:r?[.7,0,0]:[0,0,0]}}),"wave"),tp=[vs(0,!1),vs(.3,!0),vs(.6,!1)];function xl(t,r,e){let i=0;for(;i<t.length-2&&t[i+1].t<=r;)i++;let n=t.length-1,o=t[i],s=t[Math.min(i+1,n)],a=i>0?t[i-1]:e?{t:o.t-(t[n].t-t[n-1].t),v:t[n-1].v}:o,l=i+2<=n?t[i+2]:e?{t:s.t+(t[1].t-t[0].t),v:t[1].v}:s,c=s.t>o.t?Math.min(1,Math.max(0,(r-o.t)/(s.t-o.t))):0,d=c*c,h=d*c;return o.v.map((m,p)=>{let v=a.v[p],f=s.v[p],g=l.v[p],b=s.t>a.t?(f-v)/(s.t-a.t)*(s.t-o.t):0,T=l.t>o.t?(g-m)/(l.t-o.t)*(s.t-o.t):0;return(2*h-3*d+1)*m+(h-2*d+c)*b+(-2*h+3*d)*f+(h-d)*T})}u(xl,"spline");var yl=30;function xr(t,r){let e=An[t],i=r[r.length-1].t,n=Math.round(i*yl)+1,o=new Float32Array(n);for(let h=0;h<n;h++)o[h]=Math.min(i,h/yl);let s=[],a=X.create(),l=180/Math.PI;for(let h of _l){let m=r.map(v=>({t:v.t,v:v.rot[h.name]??[0,0,0]})),p=new Float32Array(n*4);for(let v=0;v<n;v++){let[f,g,b]=xl(m,o[v],e);X.fromEuler(a,f*l,g*l,b*l),p.set(a,v*4)}s.push({target:h.name,property:"rotation",times:o,values:p,interpolation:"LINEAR"})}let c=r.map(h=>({t:h.t,v:h.hips})),d=new Float32Array(n*3);for(let h=0;h<n;h++)d.set(xl(c,o[h],e),h*3);return s.unshift({target:"Hips",property:"translation",times:o,values:d,interpolation:"LINEAR"}),new xt(t,s,i)}u(xr,"clipFrom");function rp(){return[xr("Idle",jm),xr("Run",Km),xr("Jump",Qm),xr("Fall",Zm),xr("Die",ep),xr("Victory",tp)]}u(rp,"bitClips");function Ml(t){if(t.dead)return{clip:"Die",speed:1};if(t.won)return{clip:"Victory",speed:1};if(!t.onGround)return{clip:t.vy>0?"Jump":"Fall",speed:1};let r=Math.abs(t.vx);return r>.3?{clip:"Run",speed:Math.max(.6,r/$m)}:{clip:"Idle",speed:1}}u(Ml,"clipFor");var gs=16,Rn={front:1.2,back:2.4};async function Ae(t,r,e){let i=document.createElement("canvas");return i.width=r,i.height=r,e(i.getContext("2d"),r),W.for(t).getTexture(i.toDataURL("image/png"))}u(Ae,"canvasTexture");async function F(t,r,e={}){let i=new Vt;return i.color=new y(r[0],r[1],r[2],1),i.mainTex=e.tex??await W.for(t).getTexture("builtin://white"),e.glow&&(i.emissiveTex=e.glow),i.specularStrength=e.specular??.08,i.roughness=e.roughness??.8,i}u(F,"material");function ee(t,r,e){let i=new xe(r);return e&&i.transform.setParent(e.transform),t.addEntity(i),i}u(ee,"makeEntity");function ue(t,r,e,i){let n=new Xt;n.meshData=e;let o=new Ve(t);o.mesh=n,o.shader=new at(t,i),r.addBehaviour(o)}u(ue,"render");function At(t,r){let e=[],i=[],n=[],o=[];for(let{at:a,scale:l}of r){let c=e.length;t.vertices.forEach((d,h)=>{e.push([d[0]*l[0]+a[0],d[1]*l[1]+a[1],d[2]*l[2]+a[2]]);let m=t.normals[h]??[0,1,0],p=m[0]/l[0],v=m[1]/l[1],f=m[2]/l[2],g=Math.hypot(p,v,f)||1;i.push([p/g,v/g,f/g]),n.push(t.uvs[h]??[0,0])});for(let d of t.indices)o.push(c+d)}let s=new K(e,i,n,o);return s.providedNormals=!0,s}u(At,"merge");function ip(t,r,e,i,n){let o=new K([[t,r,n],[e,r,n],[e,i,n],[t,i,n]],[[0,0,1],[0,0,1],[0,0,1],[0,0,1]],[[0,1],[1,1],[1,0],[0,0]],[0,1,2,0,2,3]);return o.providedNormals=!0,o}u(ip,"quad");function np(t,r,e){let i=He(t,r,e);return i==="ground"?He(t,r,e+1)==="ground"?"earth":"grass":i==="block"||i==="spikes"?i:null}u(np,"partOf");async function op(t,r){let e=qt[r],i=await Ae(t,64,(l,c)=>{l.fillStyle=e.top[0],l.fillRect(0,0,c,c),l.fillStyle=e.top[1];for(let d=0;d<10;d++)l.fillRect(d*23%60,d*13%60,6,3);l.fillStyle=e.top[2],l.fillRect(0,c-8,c,8)}),n=await Ae(t,64,(l,c)=>{l.fillStyle=e.earth[0],l.fillRect(0,0,c,c),l.fillStyle=e.earth[1];for(let d=0;d<9;d++)l.fillRect(d*29%58,d*19%58,7,4);l.fillStyle=e.earth[2];for(let d=0;d<6;d++)l.fillRect((d*37+11)%58,(d*23+7)%58,5,3)}),o=await Ae(t,64,(l,c)=>{let[d,h,m,p]=e.block;if(l.fillStyle=d,l.fillRect(0,0,c,c),l.fillStyle=h,l.fillRect(0,0,c,6),l.fillRect(0,0,6,c),l.fillStyle=m,l.fillRect(0,c-6,c,6),l.fillRect(c-6,0,6,c),l.fillStyle=p,l.fillRect(20,20,24,24),e.blockMark&&r==="caves")l.fillStyle=e.blockMark,l.beginPath(),l.moveTo(32,14),l.lineTo(42,32),l.lineTo(32,50),l.lineTo(22,32),l.closePath(),l.fill();else if(e.blockMark){l.fillStyle=e.blockMark;for(let[v,f]of[[11,11],[53,11],[11,53],[53,53]])l.beginPath(),l.arc(v,f,3,0,Math.PI*2),l.fill()}}),s=r==="caves"?await Ae(t,64,(l,c)=>{l.fillStyle="#000",l.fillRect(0,0,c,c),l.fillStyle="#3a2a66",l.beginPath(),l.moveTo(32,14),l.lineTo(42,32),l.lineTo(32,50),l.lineTo(22,32),l.closePath(),l.fill()}):void 0,a=r==="caves"?await Ae(t,4,(l,c)=>{l.fillStyle="#0d4a44",l.fillRect(0,0,c,c)}):void 0;return{grass:await F(t,[1,1,1],{tex:i,glow:a,specular:r==="caves"?.6:.08,roughness:r==="caves"?.3:.8}),earth:await F(t,[1,1,1],{tex:n}),deep:await F(t,e.deep,{specular:0}),block:await F(t,[1,1,1],{tex:o,glow:s,specular:r==="clouds"?.5:.2,roughness:r==="clouds"?.35:.8}),spikes:await F(t,[.78,.8,.86],{specular:.7,roughness:.25})}}u(op,"tileMaterials");async function Sl(t){let r=await Ae(t,64,(s,a)=>{s.fillStyle="#c4643c",s.fillRect(0,0,a,a),s.strokeStyle="#8a3f22",s.lineWidth=4,s.strokeRect(2,2,a-4,a-4),s.beginPath(),s.moveTo(0,a/2),s.lineTo(a,a/2),s.moveTo(a/2,0),s.lineTo(a/2,a/2),s.moveTo(a/4,a/2),s.lineTo(a/4,a),s.moveTo(3*a/4,a/2),s.lineTo(3*a/4,a),s.stroke()}),e=u((s,a,l)=>{s.fillStyle=l?"#000":"#e8a91c",s.fillRect(0,0,a,a),l||(s.fillStyle="#ffd55a",s.fillRect(0,0,a,5),s.fillRect(0,0,5,a),s.fillStyle="#a86f0c",s.fillRect(0,a-5,a,5),s.fillRect(a-5,0,5,a)),s.fillStyle=l?"#7a5a10":"#fff3c4",s.beginPath(),s.moveTo(a/2,14),s.lineTo(a-16,a/2),s.lineTo(a/2,a-14),s.lineTo(16,a/2),s.closePath(),s.fill()},"bonusDraw"),i=await Ae(t,64,(s,a)=>e(s,a,!1)),n=await Ae(t,64,(s,a)=>e(s,a,!0)),o=await Ae(t,64,(s,a)=>{s.fillStyle="#8a6a3e",s.fillRect(0,0,a,a),s.fillStyle="#a3825a",s.fillRect(0,0,a,5),s.fillRect(0,0,5,a),s.fillStyle="#65492a",s.fillRect(0,a-5,a,5),s.fillRect(a-5,0,5,a),s.fillStyle="#6f5432";for(let[l,c]of[[12,12],[46,12],[12,46],[46,46]])s.fillRect(l,c,6,6)});return{brick:await F(t,[1,1,1],{tex:r}),bonus:await F(t,[1,1,1],{tex:i,glow:n,specular:.4,roughness:.4}),used:await F(t,[1,1,1],{tex:o})}}u(Sl,"blockMaterials");function bs(t=!1){let r=sp();if(!t)return r;let e=new K(r.vertices.map(i=>[i[0],-i[1],i[2]]),r.normals.map(i=>[i[0],-i[1],i[2]]),r.uvs,r.indices.map((i,n,o)=>o[n-n%3+(2-n%3)]));return e.providedNormals=!0,e}u(bs,"pyramid");function sp(){let t=[],r=[],e=[],i=[],n=[[-.5,.5],[.5,.5],[.5,-.5],[-.5,-.5]];for(let s=0;s<4;s++){let[a,l]=n[s],[c,d]=n[(s+1)%4],h=(a+c)/2,m=(l+d)/2,p=Math.hypot(h,.5,m),v=t.length;t.push([a,0,l],[c,0,d],[0,1,0]);for(let f=0;f<3;f++)r.push([h/p,.5/p,m/p]);e.push([0,1],[1,1],[.5,0]),i.push(v,v+1,v+2)}let o=new K(t,r,e,i);return o.providedNormals=!0,o}u(sp,"pyramidUp");async function El(t,r,e){let i=await op(t,e.theme),n=new ge(1),o=bs(),s=[];for(let l=0;l<e.width;l+=gs){let c={grass:[],earth:[],deep:[],block:[],spikes:[]};for(let h=l;h<Math.min(e.width,l+gs);h++)for(let m=0;m<e.height;m++){let p=np(e,h,m);if(p)if(p==="grass"||p==="earth"){let v=Rn.front+Rn.back,f=(Rn.front-Rn.back)/2;c.earth.push({at:[h+.5,m+.5,f],scale:[1,1,v]}),p==="grass"&&c.grass.push({at:[h+.5,m+.88,f],scale:[1,.26,v+.06]}),m===0&&c.deep.push({at:[h+.5,-5,f],scale:[1,10,v]})}else if(p==="spikes")for(let v of[.18,.5,.82])for(let f of[-.25,.25])c.spikes.push({at:[h+v,m,f],scale:[.3,.6,.3]});else c[p].push({at:[h+.5,m+.5,0],scale:[1,1,1]})}let d=[];for(let h of Object.keys(c)){if(!c[h].length)continue;let m=ee(r,`${e.name} ${h} ${l}`);ue(t,m,At(h==="spikes"?o:n,c[h]),i[h]),d.push(m)}s.push({x0:l,parts:d})}let a=[];for(let l of e.platforms)l.track&&(l.track.axis==="x"?a.push({at:[(l.track.from+l.track.to+l.w)/2,l.y+.78,-.75],scale:[l.track.to-l.track.from+l.w,.08,.08]}):a.push({at:[l.x+l.w/2,(l.track.from+l.track.to)/2+.78,-.75],scale:[.08,l.track.to-l.track.from+.4,.08]}));return a.length&&ue(t,ee(r,"Rails"),At(n,a),await F(t,[.35,.36,.42],{specular:.6,roughness:.3})),{showAround(l,c){for(let d of s){let h=d.x0+gs>l-c-2&&d.x0<l+c+2;for(let m of d.parts)m.show=h}},hide(){for(let l of s)for(let c of l.parts)c.show=!1}}}u(El,"dressLevel");function Et(t,r){let e=Math.sin(t*12.9898+r*78.233)*43758.5453;return e-Math.floor(e)}u(Et,"hash");async function Al(t,r,e,i="meadow"){let n=qt[i],o=await Ae(t,128,(m,p)=>{let v=m.createLinearGradient(0,0,0,p);v.addColorStop(0,n.sky[0]),v.addColorStop(.65,n.sky[1]),v.addColorStop(1,n.sky[2]),m.fillStyle=v,m.fillRect(0,0,p,p)}),s=await Ae(t,4,(m,p)=>{m.fillStyle="#000",m.fillRect(0,0,p,p)}),a=await F(t,[0,0,0],{tex:s,glow:o,specular:0});ue(t,ee(r,"Sky"),ip(-60,-30,e+60,60,-60),a);let l=u(async(m,p)=>Ae(t,4,(v,f)=>{v.fillStyle=`rgb(${m.map(g=>Math.round(g*255*p)).join(",")})`,v.fillRect(0,0,f,f)}),"glowOf"),c=new We(1,24,12);if(n.scenery==="hills"){let m=await F(t,n.far,{specular:0}),p=await F(t,n.near,{specular:0}),v=u((f,g,b,T)=>{let _=[];for(let w=-20,S=0;w<e+40;w+=g,S++){let M=b*(.7+.6*Et(S,T));_.push({at:[w,-M*.35,f],scale:[M*1.6,M,M]})}return At(c,_)},"hills");ue(t,ee(r,"Far hills"),v(-40,26,14,1),m),ue(t,ee(r,"Near hills"),v(-18,15,6,7),p)}else if(n.scenery==="crystals"){let m=bs(),p=await F(t,n.far,{glow:await l(n.far,.22),specular:.9,roughness:.15}),v=await F(t,n.near,{glow:await l(n.near,.2),specular:.9,roughness:.15}),f=await F(t,[.2,.15,.3],{specular:.1}),g=u((T,_,w,S)=>{let M=[];for(let L=-20,k=0;L<e+40;L+=_,k++)for(let I=0;I<3;I++){let D=w*(.5+Et(k*3+I,S));M.push({at:[L+(I-1)*w*.35,-.5,T+I*.5],scale:[D*.28,D,D*.28]})}return At(m,M)},"cluster");ue(t,ee(r,"Far crystals"),g(-30,17,9,2),p),ue(t,ee(r,"Near crystals"),g(-12,11,3.5,5),v);let b=[];for(let T=-20,_=0;T<e+40;T+=4,_++){let w=2+5*Et(_,9);b.push({at:[T,22,-24-6*Et(_,3)],scale:[w*.35,w,w*.35]})}ue(t,ee(r,"Stalactites"),At(bs(!0),b),f)}else{let m=await F(t,n.far,{glow:await l([1,.75,.7],.35),specular:0}),p=await F(t,n.near,{glow:await l([1,.9,.85],.3),specular:0}),v=u((_,w,S,M,L,k)=>{let I=[];for(let D=-30,O=0;D<e+50;D+=w,O++){let Y=M+L*Et(O,k);for(let J=0;J<4;J++){let N=S*(.55+.45*Et(O*4+J,k+1));I.push({at:[D+(J-1.5)*S*.8,Y+J%2*S*.25,_],scale:[N*1.3,N*.8,N]})}}return At(c,I)},"puffs");ue(t,ee(r,"Far clouds"),v(-45,30,7,4,16,1),m),ue(t,ee(r,"Cloud sea"),v(-8,6,3,-4.5,1.2,4),p),ue(t,ee(r,"Near clouds"),v(-16,22,3.5,9,6,7),p);let f=await F(t,[.62,.52,.6],{glow:await l([.9,.62,.6],.35),specular:.2}),g=await F(t,[1,.8,.4],{glow:await l([1,.75,.3],1),specular:0}),b=[],T=[];for(let _=0,w=0;_<e+40;_+=34,w++){let S=10+10*Et(w,11),M=3+2*Et(w,12);b.push({at:[_,S/2-8,-52],scale:[M,S,M]}),b.push({at:[_+M*.25,S-8+3,-52],scale:[.7,6,.7]});for(let L=0;L<3;L++)T.push({at:[_-M*.3+L*M*.3,S-8-1.5-L*2.5,-52+M/2+.05],scale:[.5,.5,.1]})}ue(t,ee(r,"Towers"),At(new ge(1),b),f),ue(t,ee(r,"Tower lamps"),At(new ge(1),T),g)}let d=new Xe("Ambient light");d.color=new y(n.ambient[0],n.ambient[1],n.ambient[2],1),r.addEntity(d);let h=new Tt("Sun");h.color=new y(n.sun[0],n.sun[1],n.sun[2],1),h.transform.rotate(50,30,0),h.castShadows=!0,r.addEntity(h)}u(Al,"dressWorld");var Cn=7.3,Qr=1.2;async function Rl(t,r,e,i){let n=ee(r,"Goal");n.transform.setLocalPosition(e,i,0);let o=ee(r,"Pole",n);o.transform.setLocalPosition(0,4,0),o.transform.setLocalScale(.08,8,.08),ue(t,o,new ge(1),await F(t,[.9,.92,.95],{specular:.5,roughness:.3}));let s=ee(r,"Pole top",n);s.transform.setLocalPosition(0,8.2,0),s.transform.setLocalScale(.25,.25,.25),ue(t,s,new We(1,16,10),await F(t,[1,.8,.2],{specular:.6,roughness:.3}));let a=ee(r,"Flag",n);a.transform.setLocalPosition(-.7,Cn,0),a.transform.setLocalScale(1.3,.9,.05),ue(t,a,new ge(1),await F(t,[.15,.85,.75]));let l=ee(r,"Pole base",n);return l.transform.setLocalPosition(0,.5,0),ue(t,l,new ge(1),await F(t,[.56,.6,.68])),{setFlag(c){a.transform.setLocalPosition(-.7,Qr+(Cn-Qr)*c,0)}}}u(Rl,"dressGoal");async function Cl(t,r){let e=ee(r,"Hero"),i=wl("Bit");i.root.transform.setParent(e.transform),r.addEntity(i.root);for(let w of i.bones.values())r.addEntity(w);let n=u(w=>i.bones.get(w),"bone"),o=new We(1,24,14),s=[],a=u((w,S,M,L,k,I)=>{let D=ee(r,w,S);return D.transform.setLocalPosition(M[0],M[1],M[2]),D.transform.setLocalScale(L[0],L[1],L[2]),ue(t,D,k,I),s.push(D),D},"part"),l=await F(t,[.95,.96,1],{specular:.6,roughness:.25}),c=await F(t,[.15,.85,.75],{specular:.3}),d=await F(t,[.06,.08,.14],{specular:.9,roughness:.1}),h=await Ae(t,4,(w,S)=>{w.fillStyle="#5ff",w.fillRect(0,0,S,S)}),m=await F(t,[.4,1,1],{glow:h,specular:0}),p=await F(t,[.6,.62,.7],{specular:.4}),v=await F(t,[1,.3,.45],{glow:h,specular:0}),f=await F(t,[.25,.27,.35],{specular:.3}),g=n("Body");a("Shell",g,[0,.27,0],[.4,.4,.4],o,l),a("Band",g,[0,.2,0],[.42,.06,.42],o,c),a("Visor",g,[0,.35,.22],[.27,.16,.2],o,d);for(let w of[-1,1])a("Eye",g,[w*.09,.37,.39],[.04,.06,.03],o,m);a("Antenna stalk",n("Antenna"),[0,.12,0],[.025,.12,.025],new ge(2),p),a("Antenna tip",n("Antenna"),[0,.26,0],[.06,.06,.06],o,v);for(let w of["R","L"])a("Arm",n(`Arm${w}`),[0,-.09,0],[.05,.12,.05],o,p),a("Hand",n(`Hand${w}`),[0,-.03,0],[.095,.095,.095],o,l),a("Leg",n(`Leg${w}`),[0,-.07,0],[.04,.08,.04],o,p),a("Foot",n(`Foot${w}`),[0,0,.04],[.12,.065,.16],o,f);let b="",T=[.15,.85,.75],_=[1,.5,.12];return{place(w,S,M,L,k){e.transform.setLocalPosition(w,S,0),e.transform.setLocalRotation(0,M,0);let I=k/Math.sqrt(L);e.transform.setLocalScale(I,k*L,I)},animate(w,S){i.animator.speed=S,w!==b&&(b?i.animator.crossFade(w,.12,{loop:An[w]}):i.animator.play(w,{loop:An[w]}),b=w)},tint(w,S,M){let L=w==="spark"?_:T;if(c.color.r=L[0],c.color.g=L[1],c.color.b=L[2],S>0){let k=M*(S<2?2:5)%1,I=u(D=>.55+.45*Math.cos(2*Math.PI*(k+D)),"c");l.color.r=I(0),l.color.g=I(1/3),l.color.b=I(2/3)}else l.color.r=.95,l.color.g=.96,l.color.b=1},setVisible(w){for(let S of s)S.show=w}}}u(Cl,"dressHero");function yr(t,r){let e=ee(t,r),i=[];return{root:e,parts:i,add(n,o,s,a,l,c=e){let d=ee(t,`${r} part`,c);return d.transform.setLocalPosition(a[0],a[1],a[2]),d.transform.setLocalScale(l[0],l[1],l[2]),ue(n,d,o,s),i.push({e:d,at:a,scale:l}),d},show(n){for(let o of i)o.e.show=n}}}u(yr,"group");function Ll(t=.35){let r=[],e=[],i=[],n=[],o=[];for(let a=0;a<10;a++){let l=Math.PI/2+a*Math.PI/5,c=a%2?.22:.5;o.push([Math.cos(l)*c,Math.sin(l)*c])}for(let a of[1,-1]){let l=r.length;r.push([0,0,a*t/2]),e.push([0,0,a]),i.push([.5,.5]);for(let[c,d]of o)r.push([c,d,a*t/2]),e.push([0,0,a]),i.push([c+.5,.5-d]);for(let c=0;c<10;c++){let d=l+1+c,h=l+1+(c+1)%10;a>0?n.push(l,d,h):n.push(l,h,d)}}for(let a=0;a<10;a++){let[l,c]=o[a],[d,h]=o[(a+1)%10],m=h-c,p=-(d-l),v=Math.hypot(m,p),f=r.length;for(let[g,b,T]of[[l,c,t/2],[d,h,t/2],[d,h,-t/2],[l,c,-t/2]])r.push([g,b,T]),e.push([m/v,p/v,0]),i.push([0,0]);n.push(f,f+2,f+1,f,f+3,f+2)}let s=new K(r,e,i,n);return s.providedNormals=!0,s}u(Ll,"starMesh");async function Xl(t,r,e){let i=e.level,n=new ge(1),o=new We(1,20,12),s=await Sl(t),a=u(async R=>Ae(t,4,(B,P)=>{B.fillStyle=R,B.fillRect(0,0,P,P)}),"glow"),l=new Map;for(let R=0;R<i.width;R++)for(let B=0;B<i.height;B++){let P=i.tiles[R][B];if(P!=="brick"&&P!=="bonus"&&P!=="power"&&P!=="star")continue;let G={};for(let A of P==="brick"?["brick"]:["bonus","used"]){let C=ee(r,`${A} ${R},${B}`);C.transform.setLocalPosition(R+.5,B+.5,0),ue(t,C,n,s[A]),G[A]=C}l.set(`${R},${B}`,{x:R,y:B,looks:G,hop:0})}let c=await F(t,[1,.78,.18],{glow:await a("#5a3f00"),specular:.9,roughness:.2}),d=new We(1,18,10),h=u(R=>{let B=ee(r,R);return ue(t,B,d,c),B.transform.setLocalScale(.32,.32,.07),B},"coinLook"),m=e.coins.map((R,B)=>h(`Coin ${B}`)),p=[],v=Array.from({length:4},(R,B)=>h(`Coin pop ${B}`));for(let R of v)R.show=!1;let f=await F(t,[1,.72,.12],{glow:await a("#6a4400"),specular:1,roughness:.15}),g=await F(t,[1,.95,.6],{glow:await a("#a08020"),specular:.6,roughness:.2}),b=Ll(.06),T=e.bigCoins.map((R,B)=>{let P=yr(r,`Big coin ${B}`),G=ee(r,"Big coin spin",P.root);P.add(t,d,f,[0,0,0],[.46,.46,.1],G);for(let A of[.08,-.08])P.add(t,b,g,[0,0,A],[.5,.5,1],G);return{g:P,spin:G}}),_=qt[i.theme],w=await F(t,_.mover,{specular:.6,roughness:.3}),S=await F(t,_.faller,{specular:.2}),M=await F(t,[.25,.26,.32],{specular:.5,roughness:.3}),L=await F(t,[.2,.14,.12],{specular:0}),k=e.platforms.map((R,B)=>{let P=yr(r,`Platform ${B}`),G=gr.thick,A=R.spec.kind==="fall";P.add(t,n,A?S:w,[0,0,0],[R.w-.04,G,1.3]);for(let C of[-1,1])P.add(t,n,M,[C*(R.w/2-.08),0,0],[.14,G+.04,1.34]);if(A)for(let C=1;C<R.w;C++)P.add(t,n,L,[-R.w/2+C+.1*(C%2?1:-1),0,.66],[.05,G*.8,.02]);return P}),I=await F(t,[.62,.32,.9],{specular:.5,roughness:.35}),D=await F(t,[1,1,1],{specular:.2}),O=await F(t,[.05,.05,.08],{specular:.6,roughness:.2}),Y=await F(t,[.95,.38,.18],{specular:.7,roughness:.25}),J=await F(t,[1,.85,.35],{specular:.3}),N=await F(t,[.18,.15,.2],{specular:.3}),we=await F(t,[1,.82,.15],{specular:.5,roughness:.3}),Ct=await F(t,[.75,.92,1],{glow:await a("#2a4a5a"),specular:.9,roughness:.1}),pt=e.enemies.map(R=>{let B=yr(r,`${R.kind} ${R.id}`),P=ee(r,`${R.kind} ${R.id} body`,B.root),G=[],A=[];if(R.kind==="walker"){B.add(t,o,I,[0,.36,0],[.42,.36,.4],P);for(let C of[-1,1])B.add(t,o,D,[C*.13,.46,.33],[.1,.12,.06],P),B.add(t,o,O,[C*.12,.45,.38],[.05,.07,.03],P),B.add(t,n,O,[C*.13,.6,.35],[.16,.035,.03],P).transform.setLocalRotation(0,0,C*-18),G.push(B.add(t,o,N,[C*.2,.05,.05],[.12,.06,.16],P))}else if(R.kind==="shell"){B.add(t,o,Y,[0,.38,0],[.42,.34,.38],P);for(let[V,De]of[[-.18,.55],[.15,.6],[0,.42],[.25,.4],[-.27,.36]])B.add(t,o,J,[V,De,.3],[.07,.07,.05],P);B.add(t,n,N,[0,.1,0],[.7,.08,.6],P);let C=B.add(t,o,N,[.42,.32,.08],[.18,.16,.16],P);G.push(C);for(let V of[-1,1]){G.push(B.add(t,o,D,[.52,.38,.08+V*.08],[.05,.06,.04],P));for(let De of[-.18,.18])G.push(B.add(t,n,N,[V*.2,.05,De],[.06,.12,.06],P))}}else{B.add(t,o,we,[0,.35,0],[.34,.3,.3],P),B.add(t,o,O,[0,.35,0],[.345,.08,.305],P),B.add(t,o,O,[0,.18,0],[.2,.08,.2],P);for(let C of[-1,1])B.add(t,o,D,[C*.11,.45,.24],[.08,.1,.05],P),B.add(t,o,O,[C*.11,.45,.28],[.04,.05,.025],P);for(let C of[-1,1]){let V=ee(r,"wing pivot",P);V.transform.setLocalPosition(C*.12,.62,-.05),B.add(t,o,Ct,[C*.2,.12,0],[.24,.12,.03],V),A.push(V)}}return{g:B,body:P,extra:G,wings:A}}),Er=await F(t,[.85,.87,.9],{specular:.5}),si=await F(t,[.55,.57,.62]),Wl=await F(t,[.15,.85,.75],{glow:await a("#0a4a40")}),Ds=e.checkpoints.map((R,B)=>{let P=yr(r,`Checkpoint ${B}`);P.root.transform.setLocalPosition(R.x,R.y,-.6),P.add(t,n,Er,[0,1.1,0],[.08,2.2,.08]),P.add(t,o,Er,[0,2.25,0],[.1,.1,.1]);let G=P.add(t,n,si,[.35,1.9,0],[.6,.4,.04]),A=P.add(t,n,Wl,[.35,1.9,0],[.6,.4,.04]);return{g:P,cp:R,off:G,on:A}}),Hl=await a("#0b5a50"),Jl=await F(t,[.15,.85,.75],{glow:Hl,specular:.6,roughness:.3}),ai=await F(t,[.82,.85,.9],{specular:.8,roughness:.25}),ql=await F(t,[1,.9,.3],{glow:await a("#806000"),specular:.2}),Yl=await F(t,[1,.45,.15],{specular:.7,roughness:.25}),Bs=await F(t,[1,.85,.3],{glow:await a("#ff9a20"),specular:0}),$l=await F(t,[1,.88,.25],{glow:await a("#7a5a00"),specular:.9,roughness:.2}),jl=Ll(),In=u((R,B)=>{let P=yr(r,`${R} ${B}`),G=ee(r,`${R} spin`,P.root),A;if(R==="battery")P.add(t,n,Jl,[0,.33,0],[.38,.5,.38],G),P.add(t,n,ai,[0,.62,0],[.18,.08,.18],G),P.add(t,n,ai,[0,.09,0],[.4,.04,.4],G),P.add(t,n,ql,[0,.36,.2],[.08,.28,.02],G).transform.setLocalRotation(0,0,20);else if(R==="thruster"){P.add(t,o,Yl,[0,.42,0],[.18,.3,.18],G),P.add(t,o,ai,[0,.62,0],[.1,.12,.1],G);for(let C of[-1,1])P.add(t,n,ai,[C*.17,.2,0],[.12,.2,.04],G);A=P.add(t,o,Bs,[0,.08,0],[.1,.16,.1],G)}else{P.add(t,jl,$l,[0,.38,0],[.75,.75,.75],G);for(let C of[-1,1])P.add(t,o,O,[C*.07,.42,.13],[.03,.06,.02],G)}return P.show(!1),{g:P,spin:G,flame:A}},"itemLook"),Ar={battery:[0,1,2].map(R=>In("battery",R)),thruster:[0,1,2].map(R=>In("thruster",R)),star:[0,1].map(R=>In("star",R))},Kl=await F(t,[1,.75,.25],{glow:await a("#ffb040"),specular:0}),Is=Array.from({length:2},(R,B)=>{let P=yr(r,`Spark ${B}`);return P.add(t,o,Kl,[0,0,0],[.16,.16,.16]),P.add(t,o,Bs,[0,0,0],[.26,.08,.08]),P.show(!1),P}),ks=Array.from({length:12},(R,B)=>{let P=ee(r,`Brick bit ${B}`);return ue(t,P,n,s.brick),P.transform.setLocalScale(.4,.4,.4),P.show=!1,P}),Lt=[],Oe=0,li=u((R,B)=>R>B.left-2&&R<B.right+2,"near"),Ql=u((R,B)=>{let P=B.body,G=B.state!=="gone"&&B.state!=="asleep";if(R.g.show(G),!G)return;R.g.root.transform.setLocalPosition(P.x,P.y,0);let A=B.dir<0?-55:55,C=1,V=0,De=0;B.state==="squashed"&&(C=.25),B.state==="out"&&(V=180,De=P.h),B.kind==="walker"&&B.state==="walk"&&(C=1+Math.sin(B.time*14)*.06),R.g.root.transform.setLocalRotation(0,A,V),R.body.transform.setLocalPosition(0,De,0),R.body.transform.setLocalScale(1/Math.sqrt(C),C,1);let ft=B.kind==="shell"&&(B.state==="shell"||B.state==="slide");for(let jt of R.extra)jt.show=!ft;B.kind==="shell"&&B.state==="slide"&&R.g.root.transform.setLocalRotation(0,Oe*900,0);for(let[jt,Zl]of R.wings.entries())Zl.transform.setLocalRotation(0,0,(jt?-1:1)*Math.sin(Oe*50)*35)},"placeEnemy");return{sync(R,B,P){Oe+=B;for(let A of l.values()){let C=R.level.tiles[A.x][A.y];A.hop=Math.max(0,A.hop-B);let V=Math.sin(A.hop/.18*Math.PI)*.3*(A.hop>0?1:0),De=li(A.x,P);for(let[ft,jt]of Object.entries(A.looks))jt.show=De&&ft===(C==="power"||C==="star"?"bonus":C),jt.transform.setLocalPosition(A.x+.5,A.y+.5+V,0)}R.coins.forEach((A,C)=>{let V=m[C];V.show=!A.taken&&li(A.x,P),V.show&&(V.transform.setLocalPosition(A.x,A.y+Math.sin(Oe*3+A.x)*.05,0),V.transform.setLocalRotation(0,Oe*180+A.x*40,0))});for(let A=p.length-1;A>=0;A--){let C=p[A];C.t+=B;let V=C.t/.45;if(V>=1){C.e.show=!1,p.splice(A,1);continue}C.e.transform.setLocalPosition(C.x,C.y+Math.sin(V*Math.PI)*1.8,.1),C.e.transform.setLocalRotation(0,C.t*1400,0)}R.enemies.forEach((A,C)=>Ql(pt[C],A)),R.bigCoins.forEach((A,C)=>{let{g:V,spin:De}=T[C],ft=!A.taken&&li(A.x,P);V.show(ft),ft&&(V.root.transform.setLocalPosition(A.x,A.y+Math.sin(Oe*2.5+A.x)*.08,0),De.transform.setLocalRotation(0,Oe*120,0))}),R.platforms.forEach((A,C)=>{let V=k[C],De=A.state!=="gone"&&A.x+A.w>P.left-2&&A.x<P.right+2;if(V.show(De),!De)return;let ft=A.state==="shake"?Math.sin(A.time*70)*.06:0;V.root.transform.setLocalPosition(A.x+A.w/2+ft,A.y+1-gr.thick/2,0)});let G={battery:0,thruster:0,star:0};for(let A of R.items){if(A.state==="gone")continue;let C=Ar[A.kind][G[A.kind]++];C&&(C.g.show(!0),C.g.root.transform.setLocalPosition(A.body.x,A.body.y,A.state==="rise"?-.05:0),C.spin.transform.setLocalRotation(0,A.kind==="star"?Math.sin(Oe*4)*25:Oe*120,0),C.flame&&C.flame.transform.setLocalScale(.1,.16*(1+.3*Math.sin(Oe*40)),.1))}for(let A of Object.keys(Ar))for(let C=G[A];C<Ar[A].length;C++)Ar[A][C].g.show(!1);Is.forEach((A,C)=>{let V=R.sparks[C];A.show(!!V),V&&(A.root.transform.setLocalPosition(V.body.x,V.body.y+V.body.h/2,.2),A.root.transform.setLocalRotation(0,0,Oe*720*-V.dir))});for(let A=Lt.length-1;A>=0;A--){let C=Lt[A];if(C.t+=B,C.vy-=40*B,C.x+=C.vx*B,C.y+=C.vy*B,C.y<-3||C.t>1.5){C.e.show=!1,Lt.splice(A,1);continue}C.e.transform.setLocalPosition(C.x,C.y,.3),C.e.transform.setLocalRotation(C.t*500,C.t*300*Math.sign(C.vx),0)}for(let A of Ds){let C=!!R.checkpoint&&R.checkpoint.x>=A.cp.x,V=li(A.cp.x,P);A.g.show(V),A.on.show=V&&C,A.off.show=V&&!C}},bump(R,B,P){let G=l.get(`${R},${B}`);if(G&&(G.hop=.18),P){let A=v.find(C=>!p.some(V=>V.e===C))??v[0];A.show=!0,p.push({e:A,x:R+.5,y:B+1,t:0})}},breakAt(R,B){for(let[P,G]of[[-3,12],[3,12],[-2.5,8],[2.5,8]]){let A=ks.find(C=>!Lt.some(V=>V.e===C))??ks[0];A.show=!0,Lt.push({e:A,x:R+.5+Math.sign(P)*.2,y:B+.5+(G>10?.2:-.2),vx:P,vy:G,t:0})}},hide(){for(let R of Object.values(Ar).flat())R.g.show(!1);for(let R of Is)R.show(!1);for(let R of Lt)R.e.show=!1;Lt.length=0;for(let R of l.values())for(let B of Object.values(R.looks))B.show=!1;for(let R of[...m,...v])R.show=!1;for(let R of pt)R.g.show(!1);for(let R of Ds)R.g.show(!1);for(let R of T)R.g.show(!1);for(let R of k)R.show(!1)}}}u(Xl,"dressThings");var re=u(t=>document.getElementById(t),"$"),mt=re("view"),Rt=re("banner"),ri=new URLSearchParams(location.search),Il=ri.has("debug"),se="loading",_r=0,ke=mt.getContext("webgl2",{antialias:!0});if(!ke)throw re("load-text").textContent="Este browser n\xE3o tem WebGL 2.",new Error("No WebGL 2");new fr().registerDependencies();W.setLoader(new nt(async t=>t));W.for(ke);ke.clearColor(.6,.82,1,1);var kl=15,ap=1.6,Ue=new oe;Ue.name="Side camera";Ue.fieldOfView=40;Ue.nearPlane=.1;Ue.farPlane=200;Ue.initialize();oe.setMainCamera(Ue);var Es=0,Qe=8,Ts=Math.tan(Ue.fieldOfView*Math.PI/360)*kl,As=1/0;function Fl(){let r=document.getElementById("top").getBoundingClientRect().bottom/Math.max(1,mt.clientHeight)*2*Ts;As=Ts-Es-r-.3}u(Fl,"measureTop");function Rs(){let t=Math.min(window.devicePixelRatio||1,2),r=Math.max(1,Math.round(mt.clientWidth*t)),e=Math.max(1,Math.round(mt.clientHeight*t));mt.width===r&&mt.height===e||(mt.width=r,mt.height=e,ke.viewport(0,0,r,e),Je.rendererWidth=r,Je.rendererHeight=e,Ue.aspectRatio=r/e,Ue.updateProjectionMatrix(),Qe=Ts*Ue.aspectRatio,Fl())}u(Rs,"resize");window.addEventListener("resize",Rs);Rs();var Pn=new Sn,H,Ne,Nl,ni,ei,Dn,Pl=1.6,Cs=1,Bn=1,ii=1,lp=7,ye={from:0,done:!1,hop:-1,x0:0,y0:0},cp=.45,Dl=0,Yt={y:0,vy:0},xs=60,$t=1,Xn=0,Mr=ri.has("auto")?Mn():null,Ms={pressed:0,jumped:0},Ls=Jt.map(()=>({done:!1,big:Array(ul).fill(!1),best:0})),wr=-1,oi=0;function Sr(t){se=t,_r=0,Rt.hidden=t!=="over",re("map").hidden=t!=="map",re("top").hidden=t==="map"||t==="loading",re("touch").hidden=!Ss||t==="map"||t==="loading",t==="over"&&(Rt.innerHTML=`<b>Fim do jogo</b><span>${H.score} pontos</span>
      <div class="actions"><button data-act="retry">Tentar outra vez</button><button data-act="map">Mapa</button></div>`)}u(Sr,"setState");var Xs=u(t=>t.map(r=>r?"\u25C6":"\u25C7").join(""),"diamonds");function up(){Rt.hidden=!1;let t=H.flag?`<small>Bandeira: +${H.flag.points}</small>`:"",r=H.bigCoins.map(i=>i.taken);Rt.innerHTML=`<b>N\xEDvel completo!</b><span>${H.score} pontos</span>${t}
    <small class="big">Moedas grandes: <i>${Xs(r)}</i></small>
    <div class="actions"><button data-act="next">Continuar</button><button data-act="retry">Repetir</button></div>`;let e=Ls[wr];e.done=!0,e.best=Math.max(e.best,H.score),r.forEach((i,n)=>{i&&(e.big[n]=!0)})}u(up,"showClearBanner");function dp(t){let r=Math.ceil(t);return`${Math.floor(r/60)}:${String(r%60).padStart(2,"0")}`}u(dp,"formatTime");function Ul(){re("big").textContent=Xs(H.bigCoins.map(t=>t.taken)),re("lives").textContent=String(H.lives),re("coins").textContent=String(H.coinCount),re("score").textContent=String(H.score).padStart(6,"0"),re("time").textContent=dp(H.time),re("time-chip").classList.toggle("hurry",H.time<60)}u(Ul,"showHud");function Ps(t){H=t,Ne=vl(t.hero.body.x,t.hero.body.y,Qe),Xn=0,Pn.clear(),Mr&&(Mr=Mn()),Cs=Bn=1,ii=1,Yt={y:0,vy:0},Dn.setFlag(1),ni.hide(),Sr("play"),Ul()}u(Ps,"begin");function Bl(){Ps(jr(Jt[wr]))}u(Bl,"restart");async function Ol(t){Sr("loading");let r=Jt[t];re("loading").classList.remove("done"),re("load-title").textContent=r.name,await ti(.1,"A montar o n\xEDvel\u2026");let e=jr(r),i=qt[e.level.theme];Re?.destroy(),Re=new dr,Re.name=r.name,Nl=await El(ke,Re,e.level),ni=await Xl(ke,Re,e),await ti(.5,"A pintar o c\xE9u\u2026"),await Al(ke,Re,e.level.width,e.level.theme),Dn=await Rl(ke,Re,e.level.goal.x,e.level.goal.y),await ti(.75,"A acordar o Bit\u2026"),ei=await Cl(ke,Re),Re.setGlRenderingContext(ke),Tr.loadScene(Re);let n=Re.renderPipeline.settings;n.toneMapping=2,n.applyQuality(Vl),Re.isRunning=!0,ke.clearColor(i.clear[0],i.clear[1],i.clear[2],1),document.body.style.background=i.page,wr=t,re("level-name").textContent=r.name,Ps(e),await ti(1,"Pronto"),re("loading").classList.add("done")}u(Ol,"loadLevel");function zl(){let t=re("worlds");t.innerHTML=ps.map((r,e)=>`
    <section class="world ${r.theme}">
      <h2>${e+1} \xB7 ${r.name}</h2>
      <ol>${r.levels.map((i,n)=>{let o=e*3+n,s=Ls[o],a=i.name.split(" \xB7 ")[1]??i.name;return`<li><button class="node${s.done?" done":""}${o===oi?" picked":""}" data-level="${o}">
          <span class="num">${e+1}-${n+1}</span><span class="name">${a}</span>
          <span class="big">${Xs(s.big)}</span>${s.best?`<span class="best">${s.best}</span>`:""}</button></li>`}).join("")}</ol>
    </section>`).join(""),t.querySelector(".picked")?.scrollIntoView({block:"nearest",inline:"nearest"}),Sr("map")}u(zl,"showMap");function Zr(t){oi=Math.max(0,Math.min(Jt.length-1,t)),zl()}u(Zr,"pick");function ys(t){oi=t,Ol(t).catch(r=>{re("load-text").textContent=`Erro: ${r?.message??r}`,console.error(r)})}u(ys,"play");function hp(){let t=Mr?fl(Mr,H,pe):Pn.read();t.jumpPressed&&(Ms.pressed=performance.now()),us(H,t,Ne.x+Qe);let r=H.hero,e=r.body;for(let o of H.events)o.type==="jump"?(Ms.jumped=performance.now(),$t=1.25):o.type==="land"?$t=.75:o.type==="stomp"||o.type==="kick"?$t=1.2:o.type==="bump"?ni.bump(o.x,o.y,o.tile==="bonus"):o.type==="break"?ni.breakAt(o.x,o.y):(o.type==="grow"||o.type==="shrink")&&(Cs=o.type==="grow"?1:Pl,Bn=o.type==="grow"?Pl:1,ii=0);if(H.dead){Yt={y:0,vy:e.y<-1?0:13},Sr("dead");return}let i=Ne.x-Qe+e.w/2;e.x<i&&(e.x=i,e.vx<0&&(e.vx=0));let n=r.riding>=0?H.platforms[r.riding]:null;if(ds(Ne,e,Qe,H.level.width,pe,H.level.start.y+Ee.above,As,e.h,!!n&&n.dx<0),H.cleared){let o=H.level.goal.y+1;e.x=H.level.goal.x-(e.y>=o?.06:.52)-e.w/2,ye={from:e.y,done:!1,hop:-1,x0:0,y0:0},Sr("clear")}}u(hp,"step");function mp(t){if(_r+=t,!H||se==="map"||se==="loading")return;if(se==="play"){Xn+=t;let c=0;for(;Xn>=pe&&c++<24&&se==="play";)hp(),Xn-=pe}else if(se==="clear"){let c=H.hero.body,d=H.level.goal.y,h=d+1;if(ye.hop<0)c.y=Math.max(Math.min(h,ye.from),c.y-lp*t),Dn.setFlag(Math.min(1,Math.max(0,(c.y-d-Qr)/(Cn-Qr)))),c.y<=Math.min(h,ye.from)+1e-9&&(ye.hop=0,ye.x0=c.x,ye.y0=c.y,Dn.setFlag(0));else if(ye.done)_r>1.2&&Rt.hidden&&up();else{ye.hop+=t;let m=Math.min(1,ye.hop/cp);c.x=ye.x0+(H.level.goal.x+.6+c.w/2-ye.x0)*m,c.y=ye.y0+(d-ye.y0)*m+1.6*Math.sin(Math.PI*m),m>=1&&(ye.done=!0,_r=0,c.onGround=!0,c.vx=0,$t=.75)}ds(Ne,c,Qe,H.level.width,t,H.level.start.y+Ee.above,As,c.h)}else if(se==="dead"&&(_r>.35&&(Yt.vy-=40*t,Yt.y+=Yt.vy*t),_r>2)){let c=ls(H);c?Ps(c):Sr("over")}Ul();let r=H.hero;Dl+=t;let e=se==="clear"&&!ye.done,i=se==="dead"?0:e?ye.hop<0?90:60:se==="clear"?20:r.facing*60;xs+=(i-xs)*(1-Math.exp(-t*14)),$t+=(1-$t)*(1-Math.exp(-t*10)),ii+=se==="play"?t:0;let n=ii>=.6||Math.floor(ii/.1)%2?Bn:Cs;ei.place(r.body.x,r.body.y+(se==="dead"?Yt.y:0),xs,$t,n);let o=r.body,s=e?{clip:"Jump",speed:1}:Ml({onGround:o.onGround,vx:o.vx,vy:o.vy,dead:se==="dead",won:se==="clear"});ei.animate(s.clip,s.speed),ei.tint(H.power,H.star,Dl);let a=se==="play"&&H.hurt>0&&Math.floor(H.hurt/.07)%2===0;ei.setVisible(se!=="over"&&r.body.y+Yt.y>-4&&!a),Nl.showAround(Ne.x,Qe),ni.sync(H,se==="play"?t:0,{left:Ne.x-Qe,right:Ne.x+Qe});let l=Ne.y-Es;Ue.transform.setLocalPosition(Ne.x,l+ap,kl),Ue.transform.lookAt(x.fromValues(Ne.x,l,0))}u(mp,"update");var Re,Tr,_s=0,Ln=0,ws=0;function Gl(t){let r=_s?Math.min((t-_s)/1e3,.1):0;_s=t,Rs(),mp(r),Tr.update(r),Tr.render(),ws++,Ln+=r,Ln>=.5&&(Il&&(re("stats").textContent=`${Math.round(ws/Ln)} fps`),ws=0,Ln=0),requestAnimationFrame(Gl)}u(Gl,"frame");function ti(t,r){return re("load-bar").style.width=`${Math.round(t*100)}%`,re("load-text").textContent=r,new Promise(e=>requestAnimationFrame(()=>e()))}u(ti,"loaded");var Vl=1,Ss=!1;async function pp(){await ti(.3,"A preparar\u2026"),Re=new dr,Re.setGlRenderingContext(ke),Tr=new bn,Tr.initialize(mt),Tr.loadScene(Re);let t=ri.get("quality"),r={low:0,medium:1,high:2};Vl=t&&t in r?r[t]:zr.suggestedQuality(ke),Ss=ri.has("touch")||matchMedia("(pointer: coarse)").matches,Ss&&(Es=1.4,Fl()),Pn.bindTouch(re("pad"),re("btn-a"),re("btn-b"));let e=u(n=>{n==="next"?Zr(Math.min(Jt.length-1,wr+1)):n==="retry"?(Rt.hidden=!0,Bl()):n==="map"&&Zr(wr)},"act");Rt.addEventListener("click",n=>{let o=n.target.closest("button");o?.dataset.act&&e(o.dataset.act)}),re("worlds").addEventListener("click",n=>{let o=n.target.closest("button");o?.dataset.level&&ys(Number(o.dataset.level))}),re("map-button").addEventListener("click",()=>{se!=="loading"&&Zr(wr)}),window.addEventListener("keydown",n=>{if(se==="map"){let o={ArrowLeft:-1,ArrowRight:1,ArrowUp:-3,ArrowDown:3,KeyA:-1,KeyD:1};n.code in o?(n.preventDefault(),Zr(oi+o[n.code])):(n.code==="Enter"||n.code==="Space")&&(n.preventDefault(),ys(oi))}else se==="clear"&&!Rt.hidden&&n.code==="Enter"?e("next"):se==="over"&&n.code==="Enter"?e("retry"):n.code==="Escape"&&(se==="play"||se==="clear"||se==="over")&&e("map")}),re("stats").hidden=!Il,window.platformer={get state(){return se},get world(){return H},get hero(){return H.hero},get level(){return H.level},get cam(){return Ne},get halfWidth(){return Qe},controls:Pn,restart:Bl,timing:Ms,play:ys,pick:Zr,progress:Ls,get autoplay(){return!!Mr},set autoplay(n){Mr=n?Mn():null}},requestAnimationFrame(Gl);let i=ri.get("level");i!==null?await Ol(Math.max(0,Math.min(Jt.length-1,Number(i)||0))):(re("loading").classList.add("done"),zl())}u(pp,"start");pp().catch(t=>{re("load-text").textContent=`Erro: ${t?.message??t}`,console.error(t)});
